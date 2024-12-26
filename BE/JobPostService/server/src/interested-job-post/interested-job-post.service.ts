import { Injectable } from '@nestjs/common';
import { InterestedJobPostRepository } from './mongoose/interested-job-post.repository';
import { InterestedJobPost } from './mongoose/interested-job-post.schema';
import { JobPostService } from 'src/job-post/job-post.service';

@Injectable()
export class InterestedJobPostService {
  constructor(
    private readonly interestedJobPostRepository: InterestedJobPostRepository,
    private readonly jobPostService: JobPostService,
  ) {}

  async markJobPostAsInterest(
    jobPostId: string,
    userId: string,
  ): Promise<InterestedJobPost> {
    if (!(await this.jobPostService.isExistJobPost(jobPostId)))
      throw new Error('공고 없음');

    const isMarkInterestedJobPost =
      await this.interestedJobPostRepository.getByUserAndPost(
        jobPostId,
        userId,
      );
    if (isMarkInterestedJobPost) throw new Error('이미 관심공고로 표시함');

    const interestedJobPost = await this.interestedJobPostRepository.create(
      jobPostId,
      userId,
    );
    return interestedJobPost;
  }

  async unmarkJobPostAsInterest(jobPostId: string, userId: string) {
    if (!(await this.jobPostService.isExistJobPost(jobPostId)))
      throw new Error('공고 없음');

    const isMarkInterestedJobPost =
      await this.interestedJobPostRepository.getByUserAndPost(
        jobPostId,
        userId,
      );

    if (!isMarkInterestedJobPost) {
      throw new Error('관심 공고로 표시되지 않음');
    }

    await this.interestedJobPostRepository.deleteByPostAndUser(
      jobPostId,
      userId,
    );
  }

  listMyInterestedJobPost(userId: string) {
    return this.interestedJobPostRepository.getByUser(userId);
  }
}
