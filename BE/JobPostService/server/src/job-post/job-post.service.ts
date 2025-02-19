import { Injectable } from '@nestjs/common';
import { JobPostRepository } from './mongoose/job-post.repository';
import { RedisService } from 'src/redis/redis.service';
import { JobPostStatus } from './mongoose/job-post.schema';
import { JobApplyService } from 'src/job-apply/grpc/job-apply.service';

@Injectable()
export class JobPostService {
  constructor(
    private readonly jobPostRepository: JobPostRepository,
    private readonly redisService: RedisService,
    private readonly jobApplyService: JobApplyService,
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
    await this.jobApplyService.rejectPendingJobApplication(jobPostId);
    return this.jobPostRepository.updateStatus(jobPostId, JobPostStatus.CLOSE);
  }

  async isExistJobPost(jobPostId): Promise<boolean> {
    const jobPost = await this.jobPostRepository.findById(jobPostId);
    return !!jobPost;
  }

  //매일 자정에 주기적으로 실행됨
  async closeExpiredShortTermJobPosts() {
    const today = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Seoul',
    });

    const closedJobPosts =
      await this.jobPostRepository.closeExpiredShortTermJobPosts(today);
    try {
      closedJobPosts.forEach((jobPost) => {
        this.jobApplyService.rejectPendingJobApplication(jobPost._id);
      });
    } catch (e) {
      console.log('만료 작업 중 오류발생', e);
    }
  }
}
