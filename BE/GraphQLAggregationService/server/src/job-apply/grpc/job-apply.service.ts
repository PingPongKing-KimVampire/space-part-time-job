import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientGrpc,
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';
import { ApplyToJobPostRequest } from './dto/apply-to-job-post/request.dto';
import {
  ApplicationStatusGrpcType,
  ApplyToJobPostResponse,
} from './dto/apply-to-job-post/response.dto';
import { ListJobApplicationByUserAndPostRequest } from './dto/list-job-application-by-user-and-post/request.dto';
import { ListJobApplicationByUserAndPostResponse } from './dto/list-job-application-by-user-and-post/response.dto';
import { CancelJobApplicationRequest } from './dto/cancel-job-application/request.dto';
import { CancelJobApplicationResponse } from './dto/cancel-job-application/response.dto';
import { listJobApplicationsByPostForPublisherRequest } from './dto/list-job-application-by-user-and-post copy/request.dto';
import { listJobApplicationsByPostForPublisherResponse } from './dto/list-job-application-by-user-and-post copy/response.dto';
import { CountJobApplicationByPostRequest } from './dto/count-job-application-by-post/request.dto';
import { CountJobApplicationByPostResponse } from './dto/count-job-application-by-post/response.dto';
import { DecideJobApplicationRequest } from './dto/decide-job-application/request.dto';
import { DecideJobApplicationResponse } from './dto/decide-job-application/response.dto';
import { ListMyJobApplicationRequest } from './dto/list-my-job-application/request.dto';
import { ListMyJobApplicationResponse } from './dto/list-my-job-application/response.dto';
import { GetMyJobApplicationRequest } from './dto/get-my-job-application/request.dto';
import { GetMyJobApplicationResponse } from './dto/get-my-job-application/response.dto';

interface JobApplyServiceGrpc {
  applyToJobPost(
    request: ApplyToJobPostRequest,
  ): Observable<ApplyToJobPostResponse>;

  listJobApplicationByUserAndPost(
    request: ListJobApplicationByUserAndPostRequest,
  ): Observable<ListJobApplicationByUserAndPostResponse>;

  cancelJobApplication(
    request: CancelJobApplicationRequest,
  ): Observable<CancelJobApplicationResponse>;

  listJobApplicationsByPostForPublisher(
    request: listJobApplicationsByPostForPublisherRequest,
  ): Observable<listJobApplicationsByPostForPublisherResponse>;

  countJobApplicationByPost(
    request: CountJobApplicationByPostRequest,
  ): Observable<CountJobApplicationByPostResponse>;

  decideJobApplication(
    request: DecideJobApplicationRequest,
  ): Observable<DecideJobApplicationResponse>;

  listMyJobApplication(
    request: ListMyJobApplicationRequest,
  ): Observable<ListMyJobApplicationResponse>;

  getMyJobApplication(
    request: GetMyJobApplicationRequest,
  ): Observable<GetMyJobApplicationResponse>;
}

@Injectable()
export class JobApplyService implements OnModuleInit {
  private jobApplyService: JobApplyServiceGrpc;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const grpcUrl = this.configService.get<string>('GRPC_JOB_APPLY_SERVER_URL');

    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'jobApply',
        protoPath: [join(__dirname, './proto/job-apply.proto')],
        url: grpcUrl,
        loader: {
          longs: Number,
        },
      },
    };

    const grpcClient = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;

    this.jobApplyService =
      grpcClient.getService<JobApplyServiceGrpc>('JobApplyService');
  }

  async applyToJobPost(data: {
    userId: string;
    jobPostId: string;
    coverLetter: string;
  }): Promise<ApplyToJobPostResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.applyToJobPost(data),
      );
      return response;
    } catch (e) {
      console.error('applyToJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async listJobApplicationByUserAndPost(request: {
    userId: string;
    jobPostId: string;
  }): Promise<ListJobApplicationByUserAndPostResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.listJobApplicationByUserAndPost(request),
      );
      return response;
    } catch (e) {
      console.error('listJobApplicationByUserAndPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async cancelJobApplication(request: {
    userId: string;
    jobApplicationId: string;
  }): Promise<CancelJobApplicationResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.cancelJobApplication(request),
      );
      return response;
    } catch (e) {
      console.error('cancelJobApplication grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async listJobApplicationsByPostForPublisher(request: {
    userId: string;
    jobPostId: string;
  }): Promise<listJobApplicationsByPostForPublisherResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.listJobApplicationsByPostForPublisher(request),
      );
      return response;
    } catch (e) {
      console.error('listJobApplicationsByPostForPublisher grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async countJobApplicationByPost(request: {
    jobPostId: string;
  }): Promise<CountJobApplicationByPostResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.countJobApplicationByPost(request),
      );
      return response;
    } catch (e) {
      console.error('countJobApplicationByPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async decideJobApplication(request: {
    jobApplicationId: string;
    userId: string;
    status: ApplicationStatusGrpcType;
  }): Promise<DecideJobApplicationResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.decideJobApplication(request),
      );
      return response;
    } catch (e) {
      console.error('decideJobApplication grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async listMyJobApplication(request: {
    userId: string;
  }): Promise<ListMyJobApplicationResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.listMyJobApplication(request),
      );
      return response;
    } catch (e) {
      console.error('listMyJobApplication grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async getMyJobApplication(request: {
    jobApplicationId: string;
    userId: string;
  }): Promise<GetMyJobApplicationResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.getMyJobApplication(request),
      );
      return response;
    } catch (e) {
      console.error('getMyJobApplication grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
