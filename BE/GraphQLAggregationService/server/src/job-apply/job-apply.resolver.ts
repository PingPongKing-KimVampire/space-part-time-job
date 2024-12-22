import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ApplyJobPostInput } from 'src/graphql';
import { JobApplyService } from './grpc/job-apply.service';
import { ApplyToJobPostResponseStatus } from './grpc/dto/apply-to-job-post/response.dto';

@Resolver()
export class JobApplyResolver {
  constructor(private readonly jobApplyService: JobApplyService) {}
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
    const status = this.getEnumKeyByValue(
      ApplyToJobPostResponseStatus,
      jobApplicationResponse.jobApplication.status,
    );
    return {
      id: jobApplicationResponse.jobApplication.id,
      coverLetter: jobApplicationResponse.jobApplication.coverLetter,
      createdAt: jobApplicationResponse.jobApplication.createdAt,
      status,
    };
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
}
