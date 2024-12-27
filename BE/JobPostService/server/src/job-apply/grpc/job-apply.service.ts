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
import { RejectPendingJobApplicationRequest } from './dto/reject-pending-job-application/request.dto';
import { RejectPendingJobApplicationResponse } from './dto/reject-pending-job-application/response.dto';

interface JobApplyServiceGrpc {
  rejectPendingJobApplication(
    data: RejectPendingJobApplicationRequest,
  ): Observable<RejectPendingJobApplicationResponse>;
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

  async rejectPendingJobApplication(
    jobPostId: string,
  ): Promise<RejectPendingJobApplicationResponse> {
    try {
      const response = await lastValueFrom(
        this.jobApplyService.rejectPendingJobApplication({ jobPostId }),
      );
      return response;
    } catch (e) {
      console.error('rejectPendingJobApplication grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
