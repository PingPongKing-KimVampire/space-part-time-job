import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateJobPostInput,
  InterestedJobPost,
  JobApplication,
  JobPost,
  JobPostConnection,
  JobPostSearchFilter,
  JobPostStatusEnum,
} from 'src/graphql';
import { JobPostService } from './grpc/job-post.service';
import { JobApplyService } from 'src/job-apply/grpc/job-apply.service';
import {
  ApplicationStatusGrpcType,
  JobApplicationGrpc,
} from 'src/job-apply/grpc/dto/apply-to-job-post/response.dto';
import { WooJooInternalError } from 'src/util/graphql.error';
import { UserService } from 'src/user/user.service';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(
    private readonly jobPostService: JobPostService,
    private readonly jobApplyService: JobApplyService,
    private readonly userService: UserService,
  ) {}

  @Mutation('createJobPost')
  async createJobPost(
    @Args('input') createJobPostInput: CreateJobPostInput,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const grpcPayload = {
      ...createJobPostInput,
      userId: user.id,
    };
    const {
      id,
      addressName: realAddressName,
      createdAt,
    } = await this.jobPostService.createJobPost(grpcPayload);
    return {
      __typename: 'JobPost',
      status: JobPostStatusEnum.OPEN,
      ...createJobPostInput,
      createdAt,
      id,
      addressName: realAddressName,
      views: 0,
      publisher: {
        __typename: 'UserPublicInfo',
        id: user.id,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
      applicationCount: {
        __typename: 'ApplicationCount',
        count: 0,
      },
      applications: {
        __typename: 'JobApplications',
        applications: [],
      },
      myJobApplication: {
        __typename: 'JobApplications',
        applications: [],
      },
      interestedCount: 0,
      myInterested: null,
    };
  }

  @Query('getJobPost')
  async getJobPost(@Args('id') jobPostId: string): Promise<JobPost> {
    const jobPost = await this.jobPostService.getJobPost(jobPostId);
    const ret = {
      __typename: 'JobPost',
      ...jobPost,
    };
    return ret;
  }

  @Query('searchJobPosts')
  async searchJobPosts(
    @Args('filters') filters: JobPostSearchFilter,
    @Args('pagination') pagination: { afterCursor: string; first: number },
    @Context('req') req: Request,
  ) {
    const { id: userId } = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );

    const grpcFilters = {
      neighborhoodIds: filters.neighborhoodIds || undefined,
      workPeriodType: filters.workPeriodType || undefined,
      days: filters.days || undefined,
      jobCategories: filters.jobCategories || undefined,
      startTime: filters.startTime || undefined,
      endTime: filters.endTime || undefined,
      keyword: filters.keyword || undefined,
      onlyMyPosts: filters.onlyMyPosts || false,
      status: filters.status || undefined,
    };

    const grpcPagination = {
      afterCursor: pagination.afterCursor || null,
      first: pagination.first,
    };

    const result = await this.jobPostService.searchJobPosts(
      grpcFilters,
      grpcPagination,
      userId,
    );

    return { __typename: 'JobPostConnection', ...result };
  }

  private parseUserDataHeader(header: string): any {
    try {
      const decodedData = Buffer.from(header, 'base64').toString('utf-8');
      const user = JSON.parse(decodedData);
      if (!user) throw new Error('유저 정보 없음');
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('유효하지 않은 유저 데이터 헤더');
    }
  }

  @Mutation('incrementJobPostViews')
  async incrementJobPostViews(
    @Args('id') jobPostId: string,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const { views } = await this.jobPostService.incrementJobPostViews(
      jobPostId,
      user.id,
    );

    return { __typename: 'ViewsCountType', count: views };
  }

  @ResolveField('publisher')
  async resolvePublisher(@Parent() jobPost, @Context('req') req: Request) {
    try {
      const publisher = await this.userService.getUserPublicInfo(
        jobPost.userId,
      );

      return {
        __typename: 'UserPublicInfo',
        ...publisher,
      };
    } catch (exception: any) {
      console.error('에러 필터: ', exception);
      return WooJooInternalError;
    }
  }

  @ResolveField('myJobApplication')
  async resolveMyJobApplication(
    @Parent() jobPost: JobPost,
    @Context('req') req: Request,
  ) {
    try {
      const { id: userId } = this.parseUserDataHeader(
        req.headers['space-part-time-job-user-data-base64'],
      );

      const response =
        await this.jobApplyService.listJobApplicationByUserAndPost({
          userId,
          jobPostId: jobPost.id,
        });

      return {
        __typename: 'JobApplications',
        applications: (response.jobApplicationList ?? []).map(
          (jobApplication) => ({
            id: jobApplication.id,
            coverLetter: jobApplication.coverLetter,
            createdAt: jobApplication.createdAt,
            jobPostId: jobApplication.jobPostId,
            userId: jobApplication.userId,
            status: this.getEnumKeyByValue(
              ApplicationStatusGrpcType,
              jobApplication.status,
            ),
          }),
        ),
      };
    } catch (exception: any) {
      console.error('에러 필터: ', exception);
      return WooJooInternalError;
    }
  }

  @ResolveField('applicationCount')
  async resolveApplicationCount(@Parent() jobPost: JobPost) {
    try {
      const response = await this.jobApplyService.countJobApplicationByPost({
        jobPostId: jobPost.id,
      });

      return {
        __typename: 'ApplicationCount',
        count: response.jobApplicationCount,
      };
    } catch (exception: any) {
      console.error('에러 필터: ', exception);
      return WooJooInternalError;
    }
  }

  @ResolveField('applications')
  async resolveApplications(
    @Parent() jobPost: JobPost,
    @Context('req') req: Request,
  ) {
    try {
      const user = this.parseUserDataHeader(
        req.headers['space-part-time-job-user-data-base64'],
      );
      const response =
        await this.jobApplyService.listJobApplicationsByPostForPublisher({
          jobPostId: jobPost.id,
          userId: user.id,
        });

      return {
        __typename: 'JobApplications',
        applications: (response.jobApplicationList ?? []).map(
          (jobApplication) =>
            this.transformJobApplicationResponse(jobApplication),
        ),
      };
    } catch (exception: any) {
      console.error('에러 필터: ', exception);
      return WooJooInternalError;
    }
  }

  @ResolveField('myInterested')
  async resolveMyInterested(
    @Parent() jobPost: JobPost,
    @Context('req') req: Request,
  ) {
    try {
      const user = this.parseUserDataHeader(
        req.headers['space-part-time-job-user-data-base64'],
      );

      const {
        interestedJobPost: { jobPostId, createdAt },
      } = await this.jobPostService.getMyInterestedJobPost(jobPost.id, user.id);
      return {
        jobPost: await this.getJobPost(jobPostId),
        createdAt: createdAt,
      };
    } catch (e) {
      //추후 gRPC의 조회 실패 오류에만 null을 반환하게 만들기
      console.log(e);
      return null;
    }
  }

  @ResolveField('interestedCount')
  async resolveInterestedCount(@Parent() jobPost: JobPost) {
    const { interestedCount } =
      await this.jobPostService.countJobPostInterested(jobPost.id);
    return interestedCount;
  }

  @Mutation('closeJobPost')
  async closeJobPost(
    @Args('id') jobPostId: string,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const jobPost = await this.jobPostService.closeJobPost(jobPostId, user.id);
    return { __typename: 'JobPost', ...jobPost };
  }

  @Mutation('markJobPostAsInterest')
  async markJobPostAsInterest(
    @Args('jobPostId') jobPostId: string,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );

    await this.jobPostService.markJobPostAsInterest(jobPostId, user.id);
    const jobPost = await this.getJobPost(jobPostId);
    return { __typename: 'JobPost', ...jobPost };
  }

  @Mutation('unmarkJobPostAsInterest')
  async unmarkJobPostAsInterest(
    @Args('jobPostId') jobPostId: string,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );

    await this.jobPostService.unmarkJobPostAsInterest(jobPostId, user.id);
    const jobPost = await this.getJobPost(jobPostId);
    return { __typename: 'JobPost', ...jobPost };
  }

  private getEnumKeyByValue<T extends object>(
    enumObj: T,
    value: T[keyof T],
  ): keyof T | undefined {
    return Object.keys(enumObj).find(
      (key) => enumObj[key as keyof T] === value,
    ) as keyof T | undefined;
  }

  private transformJobApplicationResponse(jobApplication: JobApplicationGrpc) {
    const status = this.getEnumKeyByValue(
      ApplicationStatusGrpcType,
      jobApplication.status,
    );
    return {
      id: jobApplication.id,
      coverLetter: jobApplication.coverLetter,
      createdAt: jobApplication.createdAt,
      jobPostId: jobApplication.jobPostId,
      userId: jobApplication.userId,
      status,
    };
  }
}
