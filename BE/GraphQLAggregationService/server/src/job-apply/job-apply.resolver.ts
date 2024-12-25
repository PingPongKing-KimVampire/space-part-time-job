import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ApplyJobPostInput, DecideJobApplicationInput } from 'src/graphql';
import { JobApplyService } from './grpc/job-apply.service';
import {
  ApplicationStatusGrpcType,
  JobApplicationGrpc,
} from './grpc/dto/apply-to-job-post/response.dto';
import { JobPostService } from 'src/job-post/grpc/job-post.service';
import { UserService } from 'src/user/user.service';

@Resolver('JobApplication')
export class JobApplyResolver {
  constructor(
    private readonly jobApplyService: JobApplyService,
    private readonly jobPostService: JobPostService,
    private readonly userService: UserService,
  ) {}
  @Mutation('applyToJobPost')
  async applyToJobPost(
    @Args('input') applyJobPostInput: ApplyJobPostInput,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const jobApplicationResponse = await this.jobApplyService.applyToJobPost({
      ...applyJobPostInput,
      userId: user.id,
    });
    return this.transformJobApplicationResponse(
      jobApplicationResponse.jobApplication,
    );
  }

  @Mutation('cancelJobApplication')
  async cancelJobApplication(
    @Args('id') jobApplicationId: string,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const jobApplicationResponse =
      await this.jobApplyService.cancelJobApplication({
        jobApplicationId,
        userId: user.id,
      });

    return this.transformJobApplicationResponse(
      jobApplicationResponse.jobApplication,
    );
  }

  @ResolveField('jobPost')
  async resolveJobPost(@Parent() jobApplication) {
    return this.jobPostService.getJobPost(jobApplication.jobPostId);
  }

  @ResolveField('applicant')
  async resolveApplicant(@Parent() jobApplication) {
    return this.userService.getUserPublicInfo(jobApplication.userId);
  }

  @Mutation('decideJobApplication')
  async decideJobApplication(
    @Args('input') input: DecideJobApplicationInput,
    @Context('req') req: Request,
  ) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const { jobApplication } = await this.jobApplyService.decideJobApplication({
      jobApplicationId: input.id,
      userId: user.id,
      status: ApplicationStatusGrpcType[input.status],
    });

    return this.transformJobApplicationResponse(jobApplication);
  }

  @Query('listMyJobApplications')
  async listMyJobApplications(@Context('req') req: Request) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const { jobApplicationList } =
      await this.jobApplyService.listMyJobApplication({
        userId: user.id,
      });

    return (jobApplicationList ?? []).map((jobApplication) =>
      this.transformJobApplicationResponse(jobApplication),
    );
  }

  private getEnumKeyByValue<T extends object>(
    enumObj: T,
    value: T[keyof T],
  ): keyof T | undefined {
    return Object.keys(enumObj).find(
      (key) => enumObj[key as keyof T] === value,
    ) as keyof T | undefined;
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
