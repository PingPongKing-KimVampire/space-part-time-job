import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientGrpc,
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, Observable } from 'rxjs';
import { CreateJobPostInput } from 'src/graphql';

type GrpcCreateJobPostInput = CreateJobPostInput & { userId: string };

interface JobPostServiceGrpc {
  createJobPost(data: GrpcCreateJobPostInput): Observable<{ id: string }>;
}

@Injectable()
export class JobPostService implements OnModuleInit {
  private jobPostService: JobPostServiceGrpc;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const grpcUrl = this.configService.get<string>('GRPC_JOB_POST_SERVER_URL');

    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'jobPost',
        protoPath: join(__dirname, './job-post.proto'),
        url: grpcUrl,
      },
    };

    const grpcClient = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.jobPostService =
      grpcClient.getService<JobPostServiceGrpc>('JobPostService');
  }

  async createJobPost(data: GrpcCreateJobPostInput): Promise<{ id: string }> {
    try {
      const response = await lastValueFrom(
        this.jobPostService.createJobPost(data),
      );
      return response;
    } catch (e) {
      console.error('jobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
