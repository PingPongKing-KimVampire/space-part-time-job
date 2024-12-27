import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ApplyToJobPostRequest } from './grpc/dto/apply-to-job-post/request.dto';
import {
  ApplyToJobPostResponse,
  ApplicationStatusGrpcType,
} from './grpc/dto/apply-to-job-post/response.dto';
import { JobApplyService } from './job-apply.service';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { JobPostService } from 'src/job-post/grpc/job-post.service';
import { listJobApplicationsByPostForPublisherResponse } from './grpc/dto/list-job-application-by-user-and-post/response.dto';
import { listJobApplicationsByPostForPublisherRequest } from './grpc/dto/list-job-application-by-user-and-post/request.dto';
import { JobApplyRepository } from './mongoose/job-apply.repository';
import { CancelJobApplicationRequest } from './grpc/dto/cancel-job-application/request.dto';
import { CancelJobApplicationResponse } from './grpc/dto/cancel-job-application/response.dto';
import {
  ApplicationStatus,
  JobApplication,
} from './mongoose/job-application.schema';
import { ListJobApplicationByUserAndPostRequest } from './grpc/dto/list-job-application-by-user-and-post copy/request.dto';
import { ListJobApplicationByUserAndPostResponse } from './grpc/dto/list-job-application-by-user-and-post copy/response.dto';
import { CountJobApplicationByPostRequest } from './grpc/dto/count-job-application-by-post/request.dto';
import { CountJobApplicationByPostResponse } from './grpc/dto/count-job-application-by-post/response.dto';
import { DecideJobApplicationRequest } from './grpc/dto/decide-job-application/request.dto';
import { DecideJobApplicationResponse } from './grpc/dto/decide-job-application/response.dto';
import { ListMyJobApplicationRequest } from './grpc/dto/list-my-job-application/request.dto';
import { ListMyJobApplicationResponse } from './grpc/dto/list-my-job-application/response.dto';
import { GetMyJobApplicationRequest } from './grpc/dto/get-my-job-application/request.dto';
import { GetMyJobApplicationResponse } from './grpc/dto/get-my-job-application/response.dto';
import { RejectPendingJobApplicationRequest } from './grpc/dto/reject-pending-job-application/request.dto';
import { RejectPendingJobApplicationResponse } from './grpc/dto/reject-pending-job-application/response.dto';

@Controller()
export class JobApplyController {
  constructor(
    private readonly jobApplyService: JobApplyService,
    private readonly jobApplyRepository: JobApplyRepository,
    private readonly jobPostService: JobPostService,
  ) {}
  @GrpcMethod('JobApplyService', 'applyToJobPost')
  async applyToJobPost(
    request: ApplyToJobPostRequest,
  ): Promise<ApplyToJobPostResponse> {
    request = plainToInstance(ApplyToJobPostRequest, request);
    await this.validateFormat(request);
    try {
      await this.validateJobPostId(request.jobPostId);
      const jobApplication = await this.jobApplyService.applyToJobPost({
        userId: request.userId,
        jobPostId: request.jobPostId,
        coverLetter: request.coverLetter,
      });
      return {
        jobApplication:
          this.transformJobApplicationToGrpcResponse(jobApplication),
      };
    } catch (e) {
      console.error('에러 발생: ', e);
      throw new RpcException(e);
    }
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

  private validateJobPostId(jobPostId: string) {
    return this.jobPostService.getJobPost(jobPostId);
  }

  @GrpcMethod('JobApplyService', 'ListJobApplicationByUserAndPost')
  async listJobApplicationByUserAndPost(
    request: ListJobApplicationByUserAndPostRequest,
  ): Promise<ListJobApplicationByUserAndPostResponse> {
    request = plainToInstance(ListJobApplicationByUserAndPostRequest, request);
    await this.validateFormat(request);

    const jobApplicationList =
      await this.jobApplyRepository.listJobApplicationByUserAndPost(
        request.userId,
        request.jobPostId,
      );
    return {
      jobApplicationList: jobApplicationList.map((jobApplication) =>
        this.transformJobApplicationToGrpcResponse(jobApplication),
      ),
    };
  }

  @GrpcMethod('JobApplyService', 'CancelJobApplication')
  async cancelJobApplication(
    request: CancelJobApplicationRequest,
  ): Promise<CancelJobApplicationResponse> {
    request = plainToInstance(CancelJobApplicationRequest, request);
    await this.validateFormat(request);

    try {
      const jobApplication = await this.jobApplyService.cancelJobApplication(
        request.userId,
        request.jobApplicationId,
      );
      return {
        jobApplication:
          this.transformJobApplicationToGrpcResponse(jobApplication),
      };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('JobApplyService', 'ListJobApplicationsByPostForPublisher')
  async listJobApplicationsByPostForPublisher(
    request: listJobApplicationsByPostForPublisherRequest,
  ): Promise<listJobApplicationsByPostForPublisherResponse> {
    request = plainToInstance(
      listJobApplicationsByPostForPublisherRequest,
      request,
    );
    await this.validateFormat(request);

    try {
      const jobApplicationList =
        await this.jobApplyService.listJobApplicationsByPostForPublisher(
          request.userId,
          request.jobPostId,
        );
      return {
        jobApplicationList: jobApplicationList.map((jobApplication) =>
          this.transformJobApplicationToGrpcResponse(jobApplication),
        ),
      };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  private transformJobApplicationToGrpcResponse(
    jobApplication: JobApplication,
  ) {
    return {
      id: jobApplication._id,
      userId: jobApplication.userId,
      jobPostId: jobApplication.jobPostId,
      coverLetter: jobApplication.coverLetter,
      createdAt: jobApplication.createdAt.toISOString(),
      status: ApplicationStatusGrpcType[jobApplication.status],
    };
  }

  @GrpcMethod('JobApplyService', 'CountJobApplicationByPost')
  async countCancelJobApplicationByPost(
    request: CountJobApplicationByPostRequest,
  ): Promise<CountJobApplicationByPostResponse> {
    request = plainToInstance(CountJobApplicationByPostRequest, request);
    await this.validateFormat(request);

    const jobApplicationCount =
      await this.jobApplyRepository.countUnCancelJobApplicationByPost(
        request.jobPostId,
      );
    return {
      jobApplicationCount,
    };
  }

  @GrpcMethod('JobApplyService', 'DecideJobApplication')
  async decideJobApplication(
    request: DecideJobApplicationRequest,
  ): Promise<DecideJobApplicationResponse> {
    request = plainToInstance(DecideJobApplicationRequest, request);
    await this.validateFormat(request);
    try {
      const status = this.transformGRPCStatus(request.status);
      const jobApplication = await this.jobApplyService.decideJobApplication(
        request.jobApplicationId,
        request.userId,
        status,
      );
      return {
        jobApplication:
          this.transformJobApplicationToGrpcResponse(jobApplication),
      };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('JobApplyService', 'ListMyJobApplication')
  async listMyJobApplication(
    request: ListMyJobApplicationRequest,
  ): Promise<ListMyJobApplicationResponse> {
    request = plainToInstance(ListMyJobApplicationRequest, request);
    await this.validateFormat(request);

    try {
      const jobApplicationList =
        await this.jobApplyRepository.listJobApplicationByUser(request.userId);
      return {
        jobApplicationList: jobApplicationList.map((jobApplication) =>
          this.transformJobApplicationToGrpcResponse(jobApplication),
        ),
      };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('JobApplyService', 'RejectPendingJobApplication')
  async rejectPendingJobApplication(
    request: RejectPendingJobApplicationRequest,
  ): Promise<RejectPendingJobApplicationResponse> {
    request = plainToInstance(RejectPendingJobApplicationRequest, request);
    await this.validateFormat(request);
    try {
      await this.jobApplyRepository.rejectPendingApplications(
        request.jobPostId,
      );
      return;
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('JobApplyService', 'GetMyJobApplication')
  async getMyJobApplication(
    request: GetMyJobApplicationRequest,
  ): Promise<GetMyJobApplicationResponse> {
    request = plainToInstance(GetMyJobApplicationRequest, request);
    await this.validateFormat(request);

    try {
      const jobApplication = await this.jobApplyService.getJobApplication(
        request.jobApplicationId,
        request.userId,
      );
      return {
        jobApplication:
          this.transformJobApplicationToGrpcResponse(jobApplication),
      };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  transformGRPCStatus(
    applicationStatusGrpcType: ApplicationStatusGrpcType,
  ): ApplicationStatus {
    const grpcKey = Object.keys(ApplicationStatusGrpcType).find(
      (key) => ApplicationStatusGrpcType[key] === applicationStatusGrpcType,
    );

    if (grpcKey && grpcKey in ApplicationStatus) {
      return ApplicationStatus[grpcKey];
    }

    throw new Error(`타입 에러 ${applicationStatusGrpcType}`);
  }
}
