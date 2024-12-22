import { Injectable } from '@nestjs/common';
import { JobApplyRepository } from './mongoose/job-apply.repository';
import {
  ApplicationStatus,
  JobApplication,
} from './mongoose/job-application.schema';

@Injectable()
export class JobApplyService {
  constructor(private readonly jobApplyRepository: JobApplyRepository) {}
  async applyToJobPost(input: {
    userId: string;
    jobPostId: string;
    coverLetter: string;
  }): Promise<JobApplication> {
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
}
