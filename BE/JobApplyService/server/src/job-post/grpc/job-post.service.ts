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

interface JobPostServiceGrpc {
  getJobPost(data: { id: string }): Observable<{ jobPost: { userId: string } }>;
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
        protoPath: [join(__dirname, './proto/job-post.proto')],
        url: grpcUrl,
        loader: {
          longs: Number,
        },
      },
    };

    const grpcClient = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.jobPostService =
      grpcClient.getService<JobPostServiceGrpc>('JobPostService');
  }

  async getJobPost(jobPostId: string) {
    try {
      const response = await lastValueFrom(
        this.jobPostService.getJobPost({ id: jobPostId }),
      );
      return response.jobPost;
    } catch (e) {
      console.error('getJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
