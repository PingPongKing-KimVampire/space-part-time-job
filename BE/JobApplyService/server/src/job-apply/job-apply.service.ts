import { Injectable } from '@nestjs/common';
import { JobApplyRepository } from './mongoose/job-apply.repository';
import {
  ApplicationStatus,
  JobApplication,
} from './mongoose/job-application.schema';
import { JobPostService } from 'src/job-post/grpc/job-post.service';

@Injectable()
export class JobApplyService {
  constructor(
    private readonly jobApplyRepository: JobApplyRepository,
    private readonly jobPostService: JobPostService,
  ) {}
  async applyToJobPost(input: {
    userId: string;
    jobPostId: string;
    coverLetter: string;
  }): Promise<JobApplication> {
    if (
      await this.jobApplyRepository.hasUserPendingApplicationByPost(
        input.userId,
        input.jobPostId,
      )
    ) {
      throw new Error('해당 공고에 유저가 제출한 PENDING 상태인 지원서 있음');
    }
    const jobApplication = JobApplication.of(
      input.jobPostId,
      input.userId,
      input.coverLetter,
      ApplicationStatus.PENDING,
    );
    return await this.jobApplyRepository.createJobApplication(jobApplication);
  }

  async cancelJobApplication(
    userId: string,
    applicationId: string,
  ): Promise<JobApplication> {
    const jobApplication =
      await this.jobApplyRepository.getJobApplication(applicationId);
    if (!jobApplication || jobApplication.userId !== userId)
      throw new Error('지원서 없음');
    if (jobApplication.status !== ApplicationStatus.PENDING)
      throw new Error('PENDING 상태가 아니므로 취소 불가');
    const updatedJobApplication = this.jobApplyRepository.updateStatus(
      applicationId,
      ApplicationStatus.CANCELED,
    );
    if (!updatedJobApplication) throw new Error('예상하지 못한 에러');
    return updatedJobApplication;
  }

  async listJobApplicationsByPostForPublisher(
    publisherId: string,
    jobPostId: string,
  ): Promise<JobApplication[]> {
    const jobPost = await this.jobPostService.getJobPost(jobPostId);
    if (jobPost.userId !== publisherId)
      throw new Error('공고 게시자가 아니면 지원서를 조회할 수 없음');
    const applications =
      await this.jobApplyRepository.listJobApplicationByPost(jobPostId);
    return applications.filter(
      (application) => application.status !== ApplicationStatus.CANCELED,
    );
  }

  async decideJobApplication(
    jobApplicationId: string,
    publisherId: string,
    status: ApplicationStatus,
  ): Promise<JobApplication> {
    if (
      status !== ApplicationStatus.ACCEPTED &&
      status !== ApplicationStatus.REJECTED
    ) {
      throw new Error('지원을 수락하거나 거절해야 함');
    }
    const jobApplication =
      await this.jobApplyRepository.getJobApplication(jobApplicationId);

    const jobPost = await this.jobPostService.getJobPost(
      jobApplication.jobPostId,
    );
    if (jobPost.userId !== publisherId)
      throw new Error(
        '공고 게시자가 아니면 지원서에 대해 수락하거나 거절할 수 없음',
      );

    if (jobApplication.status !== ApplicationStatus.PENDING)
      throw new Error(
        'PENDING 상태가 아니면 지원서에 대해 수락하거나 거절할 수 없음',
      );

    const updatedJobApplication = await this.jobApplyRepository.updateStatus(
      jobApplicationId,
      status,
    );
    if (!updatedJobApplication) throw new Error('예상하지 못한 에러');
    return updatedJobApplication;
  }

  async listMyJobApplication(userId: string): Promise<JobApplication[]> {
    return this.jobApplyRepository.listJobApplicationByUser(userId);
  }

  async getJobApplication(id: string, userId: string): Promise<JobApplication> {
    const jobApplication = await this.jobApplyRepository.getJobApplication(id);
    if (!jobApplication) throw new Error('지원서가 없음');
    if (jobApplication.userId !== userId)
      throw new Error('사용자가 게시한 지원서가 아님');
    return jobApplication;
  }
}
