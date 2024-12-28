import { Context, Query, Resolver } from '@nestjs/graphql';
import { JobPostService } from './grpc/job-post.service';

@Resolver('InterestedJobPost')
export class InterestedJobPostResolver {
  constructor(
    private readonly jobPostService: JobPostService,
    private readonly jobPostResolver: JobPostService,
  ) {}

  @Query('listMyInterestedJobPosts')
  async listMyInterestedJobPosts(@Context('req') req: Request) {
    const user = this.parseUserDataHeader(
      req.headers['space-part-time-job-user-data-base64'],
    );
    const { interestedJobPosts } =
      await this.jobPostService.listMyInterestedJobPost(user.id);

    return (interestedJobPosts ?? []).map(async (interestedJobPost) => ({
      jobPost: await this.jobPostResolver.getJobPost(
        interestedJobPost.jobPostId,
      ),
      createdAt: interestedJobPost.createdAt,
    }));
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
