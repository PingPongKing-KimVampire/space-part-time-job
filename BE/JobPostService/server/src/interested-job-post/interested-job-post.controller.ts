import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { InterestedJobPostService } from './interested-job-post.service';
import { MarkJobPostAsInterestRequest } from './grpc/dto/mark-job-post-as-interested/request.dto';
import { MarkJobPostAsInterestResponse } from './grpc/dto/mark-job-post-as-interested/response.dto';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { UnmarkJobPostAsInterestRequest } from './grpc/dto/unmark-job-post-as-interested/request.dto';
import { UnmarkJobPostAsInterestResponse } from './grpc/dto/unmark-job-post-as-interested/response.dto';
import { ListMyInterestedJobPostRequest } from './grpc/dto/list-my-Interested-job-post/request.dto';
import { ListMyInterestedJobPostResponse } from './grpc/dto/list-my-Interested-job-post/response.dto';
import { GetMyInterestedJobPostRequest } from './grpc/dto/get-my-Interested-job-post/request.dto';
import { GetMyInterestedJobPostResponse } from './grpc/dto/get-my-Interested-job-post/response.dto';
import { CountJobPostInterestedRequest } from './grpc/dto/count-job-post-interested/request.dto';
import { CountJobPostInterestedResponse } from './grpc/dto/count-job-post-interested/response.dto';
import { InterestedJobPostRepository } from './mongoose/interested-job-post.repository';

@Controller()
export class InterestedJobPostController {
  constructor(
    private readonly interestedJobPostService: InterestedJobPostService,
    private readonly interestedJobPostRepository: InterestedJobPostRepository,
  ) {}

  @GrpcMethod('InterestedJobPostService', 'MarkJobPostAsInterest')
  async markJobPostAsInterest(
    request: MarkJobPostAsInterestRequest,
  ): Promise<MarkJobPostAsInterestResponse> {
    try {
      request = plainToInstance(MarkJobPostAsInterestRequest, request);
      await this.validateFormat(request);
      const { createdAt } =
        await this.interestedJobPostService.markJobPostAsInterest(
          request.jobPostId,
          request.userId,
        );
      return { createdAt: createdAt.toISOString() };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('InterestedJobPostService', 'UnmarkJobPostAsInterest')
  async unmarkJobPostAsInterest(
    request: UnmarkJobPostAsInterestRequest,
  ): Promise<UnmarkJobPostAsInterestResponse> {
    try {
      request = plainToInstance(UnmarkJobPostAsInterestRequest, request);
      await this.validateFormat(request);

      await this.interestedJobPostService.unmarkJobPostAsInterest(
        request.jobPostId,
        request.userId,
      );
      return {};
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('InterestedJobPostService', 'ListMyInterestedJobPost')
  async listMyInterestedJobPost(
    request: ListMyInterestedJobPostRequest,
  ): Promise<ListMyInterestedJobPostResponse> {
    request = plainToInstance(ListMyInterestedJobPostRequest, request);
    await this.validateFormat(request);
    try {
      const interestedJobPosts =
        await this.interestedJobPostService.listMyInterestedJobPost(
          request.userId,
        );
      return {
        interestedJobPosts: interestedJobPosts.map((interestedJobPost) => ({
          jobPostId: interestedJobPost.jobPostId,
          createdAt: interestedJobPost.createdAt.toISOString(),
        })),
      };
    } catch (e) {
      console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('InterestedJobPostService', 'GetMyInterestedJobPost')
  async getMyInterestedJobPost(
    request: GetMyInterestedJobPostRequest,
  ): Promise<GetMyInterestedJobPostResponse> {
    request = plainToInstance(GetMyInterestedJobPostRequest, request);
    await this.validateFormat(request);
    try {
      const interestedJobPost =
        await this.interestedJobPostService.getMyInterestedJobPost(
          request.jobPostId,
          request.userId,
        );
      return {
        interestedJobPost: {
          jobPostId: interestedJobPost.jobPostId,
          createdAt: interestedJobPost.createdAt.toISOString(),
        },
      };
    } catch (e) {
      if (e.message !== '관심 공고 아님') console.error('에러 발생', e);
      throw new RpcException(e);
    }
  }

  @GrpcMethod('InterestedJobPostService', 'CountJobPostInterested')
  async countJobPostInterested(
    request: CountJobPostInterestedRequest,
  ): Promise<CountJobPostInterestedResponse> {
    request = plainToInstance(CountJobPostInterestedRequest, request);
    await this.validateFormat(request);
    try {
      const interestedCount =
        await this.interestedJobPostRepository.countByPost(request.jobPostId);
      return {
        interestedCount,
      };
    } catch (e) {
      console.error('에러 발생', e);
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
}
