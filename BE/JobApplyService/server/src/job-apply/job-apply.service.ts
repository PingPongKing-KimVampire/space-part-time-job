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
}
