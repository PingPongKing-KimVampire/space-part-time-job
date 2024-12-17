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
import { CreateJobPostInput, JobPost, UserPublicInfo } from 'src/graphql';
import {
  DayOfWeekMapping,
  JobCategoryMapping,
  SalaryTypeMapping,
  WorkPeriodTypeMapping,
  WorkTimeTypeMapping,
} from './job-post.enum-mapping';
import { UserService } from 'src/user/user.service';

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

type grpcJobPost = JobPost & { userId: string };

type GrpcSearchJobPostsResponse = {
  result: {
    totalCount: number;
    edges: { cursor: string; node: grpcJobPost }[];
    pageInfo: { hasNextPage: boolean; endCursor?: string };
  };
};

type GrpcGetJobPostResponse = {
  jobPost: grpcJobPost;
};

interface JobPostServiceGrpc {
  createJobPost(
    data: GrpcCreateJobPostInput,
  ): Observable<{ id: string; addressName: string; createdAt: string }>;

  searchJobPosts(
    data: GrpcSearchJobPostsRequest,
  ): Observable<GrpcSearchJobPostsResponse>;

  getJobPost(data: { id: string }): Observable<GrpcGetJobPostResponse>;
}

@Injectable()
export class JobPostService implements OnModuleInit {
  private jobPostService: JobPostServiceGrpc;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

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
      response.result = await this.transformGrpcJobPostsResponse(
        response.result,
      );
      return response.result;
    } catch (e) {
      console.error('searchJobPosts grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  private async transformGrpcJobPostsResponse(
    result: GrpcSearchJobPostsResponse['result'],
  ): Promise<GrpcSearchJobPostsResponse['result']> {
    result.edges ??= [];
    result.pageInfo.endCursor ??= null;

    for (const edge of result.edges) {
      await this.transformGrpcJobPost(edge.node);
    }

    return result;
  }

  private async transformGrpcJobPost(jobPost: grpcJobPost): Promise<JobPost> {
    if (jobPost.jobDescription) {
      jobPost.jobDescription = jobPost.jobDescription.map(
        (jobDescription) => JobCategoryMapping[jobDescription],
      );
    }

    jobPost.salary.salaryType = SalaryTypeMapping[jobPost.salary.salaryType];
    jobPost.workPeriod.type = WorkPeriodTypeMapping[jobPost.workPeriod.type];
    jobPost.workTime.type = WorkTimeTypeMapping[jobPost.workTime.type];

    if (jobPost.workPeriod.days) {
      jobPost.workPeriod.days = jobPost.workPeriod.days.map(
        (day) => DayOfWeekMapping[day],
      );
    }

    jobPost.publisher = await this.userService.getUserPublicInfo(
      jobPost.userId,
    );

    return jobPost;
  }

  async getJobPost(id: string): Promise<JobPost> {
    try {
      const response = await lastValueFrom(
        this.jobPostService.getJobPost({ id }),
      );
      const { jobPost } = response;
      this.transformGrpcJobPost(jobPost);
      jobPost.publisher = await this.userService.getUserPublicInfo(
        jobPost.userId,
      );
      return jobPost;
    } catch (e) {
      console.error('getJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
