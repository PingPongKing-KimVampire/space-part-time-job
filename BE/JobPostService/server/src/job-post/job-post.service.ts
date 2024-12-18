import { Injectable } from '@nestjs/common';
import { JobPostRepository } from './mongoose/job-post.repository';
import { RedisService } from 'src/redis/redis.service';

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
}
