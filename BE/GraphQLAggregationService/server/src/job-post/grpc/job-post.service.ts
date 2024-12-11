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
import { CreateJobPostInput, JobPost } from 'src/graphql';
import {
  DayOfWeekMapping,
  JobCategoryMapping,
  SalaryTypeMapping,
  WorkPeriodTypeMapping,
  WorkTimeTypeMapping,
} from './job-post.enum-mapping';

type GrpcCreateJobPostInput = CreateJobPostInput & { userId: string };

type GrpcSearchJobPostsRequest = {
  filters: {
    neighborhoodIds: string[];
    workPeriodType?: string;
    days?: string[];
    jobCategories?: string[];
    startTime?: string;
    endTime?: string;
    keyword?: string;
  };
  pagination: {
    afterCursor?: string;
    first: number;
  };
};

type GrpcSearchJobPostsResponse = {
  result: {
    totalCount: number;
    edges: { cursor: string; node: JobPost }[];
    pageInfo: { hasNextPage: boolean; endCursor?: string };
  };
};

interface JobPostServiceGrpc {
  createJobPost(
    data: GrpcCreateJobPostInput,
  ): Observable<{ id: string; addressName: string; createdAt: string }>;

  searchJobPosts(
    data: GrpcSearchJobPostsRequest,
  ): Observable<GrpcSearchJobPostsResponse>;
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
      },
    };

    const grpcClient = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.jobPostService =
      grpcClient.getService<JobPostServiceGrpc>('JobPostService');
  }

  async createJobPost(
    data: GrpcCreateJobPostInput,
  ): Promise<{ id: string; addressName: string; createdAt: string }> {
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

  async searchJobPosts(
    filters: GrpcSearchJobPostsRequest['filters'],
    pagination: GrpcSearchJobPostsRequest['pagination'],
  ): Promise<GrpcSearchJobPostsResponse['result']> {
    try {
      const response = await lastValueFrom(
        this.jobPostService.searchJobPosts({ filters, pagination }),
      );
      response.result = this.transformGrpcJobPostsResponse(response.result);
      return response.result;
    } catch (e) {
      console.error('searchJobPosts grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  private transformGrpcJobPostsResponse(
    result: GrpcSearchJobPostsResponse['result'],
  ): GrpcSearchJobPostsResponse['result'] {
    result.edges ??= [];
    result.pageInfo.endCursor ??= null;

    result.edges = result.edges.map((edge) =>
      this.transformGrpcJobPostEdge(edge),
    );

    return result;
  }

  private transformGrpcJobPostEdge(
    edge: GrpcSearchJobPostsResponse['result']['edges'][number],
  ): GrpcSearchJobPostsResponse['result']['edges'][number] {
    if (edge.node.jobDescription) {
      edge.node.jobDescription = edge.node.jobDescription.map(
        (jobDescription) => JobCategoryMapping[jobDescription],
      );
    }

    edge.node.salary.salaryType =
      SalaryTypeMapping[edge.node.salary.salaryType];
    edge.node.workPeriod.type =
      WorkPeriodTypeMapping[edge.node.workPeriod.type];
    edge.node.workTime.type = WorkTimeTypeMapping[edge.node.workTime.type];

    if (edge.node.workPeriod.days) {
      edge.node.workPeriod.days = edge.node.workPeriod.days.map(
        (day) => DayOfWeekMapping[day],
      );
    }

    return edge;
  }
}
