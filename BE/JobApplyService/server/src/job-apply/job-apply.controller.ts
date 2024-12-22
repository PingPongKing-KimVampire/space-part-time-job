import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ApplyToJobPostRequest } from './grpc/dto/apply-to-job-post/request.dto';
import {
  ApplyToJobPostResponse,
  ApplyToJobPostResponseStatus,
} from './grpc/dto/apply-to-job-post/response.dto';
import { JobApplyService } from './job-apply.service';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Controller()
export class JobApplyController {
  constructor(private readonly jobApplyService: JobApplyService) {}
  @GrpcMethod('JobApplyService', 'applyToJobPost')
  async applyToJobPost(
    request: ApplyToJobPostRequest,
  ): Promise<ApplyToJobPostResponse> {
    request = plainToInstance(ApplyToJobPostRequest, request);
    await this.validateFormat(request);
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

  private async validateFormat<T extends object>(input: T): Promise<void> {
    const errors = await validate(input);
    if (errors.length > 0) {
      const errorMessage = this.getErrorMessage(errors);
      throw new RpcException(errorMessage);
    }
  }

  private getErrorMessage(errors: ValidationError[]) {
    const errorMessage = errors
      .flatMap((error) =>
        Object.values(error.constraints || [])
          .map((msg) => `${error.property}: ${msg}`)
          .concat(
            error.children?.flatMap((child) =>
              Object.values(child.constraints || []).map(
                (msg) => `${child.property}: ${msg}`,
              ),
            ) || [],
          ),
      )
      .join('; ');
    return errorMessage;
  }
}
