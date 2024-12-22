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
  JobPost,
  JobPostConnection,
  JobPostSearchFilter,
} from 'src/graphql';
import { JobPostService } from './grpc/job-post.service';
import { JobApplyService } from 'src/job-apply/grpc/job-apply.service';
import { ApplicationStatusGrpcType } from 'src/job-apply/grpc/dto/apply-to-job-post/response.dto';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(
    private readonly jobPostService: JobPostService,
    private readonly jobApplyService: JobApplyService,
  ) {}

  @Mutation('createJobPost')
  async createJobPost(
    @Args('input') createJobPostInput: CreateJobPostInput,
    @Context('req') req: Request,
  ): Promise<JobPost> {
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
      ...createJobPostInput,
      createdAt,
      id,
      addressName: realAddressName,
      views: 0,
      publisher: {
        id: user.id,
        nickname: user.nickname,
        createdAt: user.createdAt,
      },
    };
  }

  @Query('getJobPost')
  async getJobPost(@Args('id') jobPostId: string): Promise<JobPost> {
    const jobPost = await this.jobPostService.getJobPost(jobPostId);
    return jobPost;
  }

  @Query('searchJobPosts')
  async searchJobPosts(
    @Args('filters') filters: JobPostSearchFilter,
    @Args('pagination') pagination: { afterCursor: string; first: number },
  ): Promise<JobPostConnection> {
    const grpcFilters = {
      neighborhoodIds: filters.neighborhoodIds,
      workPeriodType: filters.workPeriodType || undefined,
      days: filters.days || undefined,
      jobCategories: filters.jobCategories || undefined,
      startTime: filters.startTime || undefined,
      endTime: filters.endTime || undefined,
      keyword: filters.keyword || undefined,
    };

    const grpcPagination = {
      afterCursor: pagination.afterCursor || null,
      first: pagination.first,
    };

    const result = await this.jobPostService.searchJobPosts(
      grpcFilters,
      grpcPagination,
    );

    return result;
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
  ): Promise<number> {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const { views } = await this.jobPostService.incrementJobPostViews(
      jobPostId,
      user.id,
    );
    return views;
  }

  @ResolveField('myJobApplication')
  async resolveMyJobApplication(
    @Parent() jobPost: JobPost,
    @Context('req') req: Request,
  ) {
    const { id: userId } = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );

    const response = await this.jobApplyService.listJobApplicationByUserAndPost(
      {
        userId,
        jobPostId: jobPost.id,
      },
    );

    return response.jobApplicationList.map((jobApplication) => ({
      id: jobApplication.id,
      coverLetter: jobApplication.coverLetter,
      createdAt: jobApplication.createdAt,
      jobPostId: jobApplication.jobPostId,
      userId: jobApplication.userId,
      status: this.getEnumKeyByValue(
        ApplicationStatusGrpcType,
        jobApplication.status,
      ),
    }));
  }

  private getEnumKeyByValue<T extends object>(
    enumObj: T,
    value: T[keyof T],
  ): keyof T | undefined {
    return Object.keys(enumObj).find(
      (key) => enumObj[key as keyof T] === value,
    ) as keyof T | undefined;
  }
}
