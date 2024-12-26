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

@Controller()
export class InterestedJobPostController {
  constructor(
    private readonly interestedJobPostService: InterestedJobPostService,
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
