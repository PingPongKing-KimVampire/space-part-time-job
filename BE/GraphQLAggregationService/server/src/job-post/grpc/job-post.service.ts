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
  DayOfWeekEnumMapping,
  JobCategoryEnumMapping,
  JobPostStatusEnumMapping,
  SalaryEnumMapping,
  WorkPeriodEnumMapping,
  WorkTimeEnumMapping,
} from './job-post-service/dto/job-post.enum-mapping';
import { UserService } from 'src/user/user.service';
import { CloseJobPostRequest } from './job-post-service/dto/close-job-post/request.dto';
import { MarkJobPostAsInterestRequest } from './interested-job-post-service/dto/mark-job-post-as-interested/request.dto';
import { MarkJobPostAsInterestResponse } from './interested-job-post-service/dto/mark-job-post-as-interested/response.dto';
import { UnmarkJobPostAsInterestRequest } from './interested-job-post-service/dto/unmark-job-post-as-interested/request.dto';
import { UnmarkJobPostAsInterestResponse } from './interested-job-post-service/dto/unmark-job-post-as-interested/response.dto';
import { ListMyInterestedJobPostRequest } from './interested-job-post-service/dto/list-my-Interested-job-post/request.dto';
import { ListMyInterestedJobPostResponse } from './interested-job-post-service/dto/list-my-Interested-job-post/response.dto';
import { GetMyInterestedJobPostRequest } from './interested-job-post-service/dto/get-my-Interested-job-post/request.dto';
import { GetMyInterestedJobPostResponse } from './interested-job-post-service/dto/get-my-Interested-job-post/response.dto';
import { CountJobPostInterestedRequest } from './interested-job-post-service/dto/count-job-post-interested/request.dto';
import { CountJobPostInterestedResponse } from './interested-job-post-service/dto/count-job-post-interested/response.dto';

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
} & { userId: string };

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
  incrementJobPostViews(data: {
    jobPostId: string;
    userId: string;
  }): Observable<{ views: number }>;

  closeJobPost(data: CloseJobPostRequest): Observable<GrpcGetJobPostResponse>;
}

interface InterestedJobPostServiceGrpc {
  MarkJobPostAsInterest(
    data: MarkJobPostAsInterestRequest,
  ): Observable<MarkJobPostAsInterestResponse>;

  UnmarkJobPostAsInterest(
    data: UnmarkJobPostAsInterestRequest,
  ): Observable<UnmarkJobPostAsInterestResponse>;

  listMyInterestedJobPost(
    data: ListMyInterestedJobPostRequest,
  ): Observable<ListMyInterestedJobPostResponse>;

  getMyInterestedJobPost(
    data: GetMyInterestedJobPostRequest,
  ): Observable<GetMyInterestedJobPostResponse>;

  countJobPostInterested(
    data: CountJobPostInterestedRequest,
  ): Observable<CountJobPostInterestedResponse>;
}

@Injectable()
export class JobPostService implements OnModuleInit {
  private jobPostService: JobPostServiceGrpc;
  private InterestedJobPostService: InterestedJobPostServiceGrpc;

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
        protoPath: [
          join(__dirname, './job-post-service/proto/job-post.proto'),
          join(
            __dirname,
            './interested-job-post-service/proto/interested-job-post.proto',
          ),
        ],
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

    this.InterestedJobPostService =
      grpcClient.getService<InterestedJobPostServiceGrpc>(
        'InterestedJobPostService',
      );
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
    userId: string,
  ): Promise<GrpcSearchJobPostsResponse['result']> {
    try {
      const response = await lastValueFrom(
        this.jobPostService.searchJobPosts({ filters, pagination, userId }),
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
    if (jobPost.JobCategories) {
      jobPost.JobCategories = jobPost.JobCategories.map(
        (jobCategory) => JobCategoryEnumMapping[jobCategory],
      );
    }

    if (jobPost.status) {
      jobPost.status = JobPostStatusEnumMapping[jobPost.status];
    }

    jobPost.salary.salaryType = SalaryEnumMapping[jobPost.salary.salaryType];
    jobPost.workPeriod.type = WorkPeriodEnumMapping[jobPost.workPeriod.type];
    jobPost.workTime.type = WorkTimeEnumMapping[jobPost.workTime.type];

    if (jobPost.workPeriod.days) {
      jobPost.workPeriod.days = jobPost.workPeriod.days.map(
        (day) => DayOfWeekEnumMapping[day],
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

  async incrementJobPostViews(
    jobPostId: string,
    userId: string,
  ): Promise<{ views: number }> {
    try {
      const response = await lastValueFrom(
        this.jobPostService.incrementJobPostViews({ jobPostId, userId }),
      );
      return { views: response.views };
    } catch (e) {
      console.error('incrementJobPostViews grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async closeJobPost(jobPostId: string, userId: string): Promise<JobPost> {
    try {
      const response = await lastValueFrom(
        this.jobPostService.closeJobPost({ userId, jobPostId }),
      );
      const { jobPost } = response;
      this.transformGrpcJobPost(jobPost);
      jobPost.publisher = await this.userService.getUserPublicInfo(
        jobPost.userId,
      );
      return jobPost;
    } catch (e) {
      console.error('closeJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async markJobPostAsInterest(
    jobPostId: string,
    userId: string,
  ): Promise<MarkJobPostAsInterestResponse> {
    try {
      const { createdAt } = await lastValueFrom(
        this.InterestedJobPostService.MarkJobPostAsInterest({
          userId,
          jobPostId,
        }),
      );
      return { createdAt };
    } catch (e) {
      console.error('markJobPostAsInterest grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async unmarkJobPostAsInterest(
    jobPostId: string,
    userId: string,
  ): Promise<UnmarkJobPostAsInterestResponse> {
    try {
      await lastValueFrom(
        this.InterestedJobPostService.UnmarkJobPostAsInterest({
          userId,
          jobPostId,
        }),
      );
      return {};
    } catch (e) {
      console.error('unmarkJobPostAsInterest grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async listMyInterestedJobPost(
    userId: string,
  ): Promise<ListMyInterestedJobPostResponse> {
    try {
      const interestedJobPosts = await lastValueFrom(
        this.InterestedJobPostService.listMyInterestedJobPost({
          userId,
        }),
      );
      return interestedJobPosts;
    } catch (e) {
      console.error('listMyInterestedJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async getMyInterestedJobPost(
    jobPostId: string,
    userId: string,
  ): Promise<GetMyInterestedJobPostResponse> {
    try {
      const interestedJobPost = await lastValueFrom(
        this.InterestedJobPostService.getMyInterestedJobPost({
          jobPostId,
          userId,
        }),
      );
      return interestedJobPost;
    } catch (e) {
      console.error('getMyInterestedJobPost grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }

  async countJobPostInterested(
    jobPostId: string,
  ): Promise<CountJobPostInterestedResponse> {
    try {
      const response = await lastValueFrom(
        this.InterestedJobPostService.countJobPostInterested({
          jobPostId,
        }),
      );
      return response;
    } catch (e) {
      console.error('countJobPostInterested grpc 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
