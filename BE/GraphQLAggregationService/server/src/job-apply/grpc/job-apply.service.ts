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
import { ApplyToJobPostResponse } from './dto/apply-to-job-post/response.dto';

interface JobApplyServiceGrpc {
  applyToJobPost(
    request: ApplyToJobPostRequest,
  ): Observable<ApplyToJobPostResponse>;
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
      console.error('getJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
