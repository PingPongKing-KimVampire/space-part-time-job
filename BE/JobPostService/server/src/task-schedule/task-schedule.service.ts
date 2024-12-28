import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JobPostService } from 'src/job-post/job-post.service';

@Injectable()
export class TaskScheduleService {
  constructor(private readonly jobPostService: JobPostService) {}

  @Cron('0 0 0 * * *', { timeZone: 'Asia/Seoul' })
  async closeExpiredShortTermJobPosts() {
    console.log('공고 만료 작업 게시');
    await this.jobPostService.closeExpiredShortTermJobPosts();
    console.log('공고 만료 작업 완료');
  }
}
