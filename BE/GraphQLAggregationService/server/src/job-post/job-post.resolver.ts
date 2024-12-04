import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateJobPostInput, JobPost } from 'src/graphql';
import { JobPostService } from './grpc/job-post.service';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(private readonly jobPostService: JobPostService) {}

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
    const { id, addressName: realAddressName } =
      await this.jobPostService.createJobPost(grpcPayload);
    return { ...createJobPostInput, id, addressName: realAddressName };
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
