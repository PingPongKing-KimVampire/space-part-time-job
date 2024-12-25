import { Injectable } from '@nestjs/common';
import { JobPostRepository } from './mongoose/job-post.repository';
import { RedisService } from 'src/redis/redis.service';
import { JobPostStatus } from './mongoose/job-post.schema';

@Injectable()
export class JobPostService {
  constructor(
    private readonly jobPostRepository: JobPostRepository,
    private readonly redisService: RedisService,
  ) {}

  public async incrementJobPostViews(
    jobPostId: string,
    userId: string,
  ): Promise<{ views: number }> {
    if (await this.isPostMarkedAsViewedByUser(jobPostId, userId)) {
      const { views } = await this.jobPostRepository.findById(jobPostId);
      return { views };
    }
    await this.markPostAsViewedByUser(jobPostId, userId);
    const { views } = await this.jobPostRepository.incrementViews(jobPostId);
    return { views };
  }

  private async isPostMarkedAsViewedByUser(
    jobPostId: string,
    userId: string,
  ): Promise<boolean> {
    const key = this.getRedisKey(jobPostId, userId);
    const value = await this.redisService.get(key);
    return value === this.getRedisViewedValue();
  }

  private async markPostAsViewedByUser(
    jobPostId: string,
    userId: string,
  ): Promise<void> {
    const key = this.getRedisKey(jobPostId, userId);
    const expiration = 24 * 60 * 60;
    await this.redisService.set(key, this.getRedisViewedValue(), expiration);
  }

  private getRedisKey(jobPostId: string, userId: string) {
    const key = `${jobPostId}:${userId}`;
    return key;
  }

  private getRedisViewedValue() {
    return 'viewed';
  }

  async closeJobPost(jobPostId: string, userId: string) {
    const jobPost = await this.jobPostRepository.findById(jobPostId);
    if (!jobPost) throw new Error('공고를 찾을 수 없음');
    if (jobPost.userId !== userId) throw new Error('공고에 접근할 권한 없음');
    if (jobPost.status === JobPostStatus.CLOSE)
      throw new Error('이미 닫힌 공고임');
    return this.jobPostRepository.updateStatus(jobPostId, JobPostStatus.CLOSE);
  }
}
