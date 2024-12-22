import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ApplyToJobPostRequest } from './grpc/dto/apply-to-job-post/request.dto';
import {
  ApplyToJobPostResponse,
  ApplyToJobPostResponseStatus,
} from './grpc/dto/apply-to-job-post/response.dto';
import { JobApplyService } from './job-apply.service';

@Controller()
export class JobApplyController {
  constructor(private readonly jobApplyService: JobApplyService) {}
  @GrpcMethod('JobApplyService', 'applyToJobPost')
  async applyToJobPost(
    request: ApplyToJobPostRequest,
  ): Promise<ApplyToJobPostResponse> {
    const jobApplication = await this.jobApplyService.applyToJobPost({
      userId: request.userId,
      jobPostId: request.jobPostId,
      coverLetter: request.coverLetter,
    });
    return {
      jobApplication: {
        id: jobApplication._id,
        userId: jobApplication.userId,
        jobPostId: jobApplication.jobPostId,
        coverLetter: jobApplication.coverLetter,
        createdAt: jobApplication.createdAt.toISOString(),
        status: ApplyToJobPostResponseStatus[jobApplication.status],
      },
    };
  }
}
