import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JobPostRepository } from './mongoose/job-post.repository';
import { CreateJobPostInput } from './grpc/dto/create-job-post/job-post.input.dto';

import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SearchJobPostsInput } from './grpc/dto/search-job-posts/search-job-posts.input.dto';

@Controller()
export class JobPostController {
  constructor(
    private readonly jobPostRepository: JobPostRepository,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @GrpcMethod('JobPostService', 'CreateJobPost')
  async createJobPost(
    input: CreateJobPostInput,
  ): Promise<{ id: string; addressName: string }> {
    input = plainToInstance(CreateJobPostInput, input);
    await this.validateFormat(input);
    await this.validateImageUrl(input);
    const officialAddressName = await this.validateAddressName(
      input.addressName,
    );

    try {
      const createdJobPost = await this.jobPostRepository.createJobPost({
        ...input,
        addressName: officialAddressName,
      });
      return { id: createdJobPost.id, addressName: officialAddressName };
    } catch (e) {
      console.error('예상하지 못한 에러', e);
      throw new RpcException('예상하지 못한 에러');
    }
  }

  private async validateFormat(input: CreateJobPostInput) {
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

  private async validateImageUrl(input: CreateJobPostInput) {
    const { userId, photos } = input;
    const isValidImageUrl =
      await this.imageUploadService.areAllUserImageURLList(userId, photos);
    if (!isValidImageUrl) {
      throw new RpcException('유저가 업로드한 이미지 아님');
    }
  }

  private async validateAddressName(addressName: string) {
    const { meta, documents } = await this.fetchKakaoAPI(addressName);
    const totalCount = meta?.total_count;
    if (!totalCount) {
      throw new RpcException('존재하지 않는 주소임');
    }

    const addressObj = documents[0];
    if (
      addressObj.address_type != 'ROAD_ADDR' &&
      addressObj.address_type != 'REGION_ADDR'
    ) {
      throw new RpcException('이 주소는 지번 주소나 도로명 주소가 아님');
    }
    return addressObj.address_name;
  }

  async fetchKakaoAPI(addressName: string) {
    const kakaoApiUrl = 'https://dapi.kakao.com/v2/local/search/address.json';
    const apiKey = process.env.KAKAO_REST_API_KEY;
    try {
      const response = await fetch(
        `${kakaoApiUrl}?analyze_type=similar&page=1&size=1&query=${encodeURIComponent(addressName)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${apiKey}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('예상하지 못한 오류', error);
      throw error;
    }
  }

  @GrpcMethod('JobPostService', 'SearchJobPosts')
  async searchJobPosts(input: SearchJobPostsInput) {
    console.log(input);
    input = plainToInstance(SearchJobPostsInput, input);
    const { filters, pagination } = input;
    try {
      const { totalCount, edges, pageInfo } =
        await this.jobPostRepository.searchJobPosts(filters, pagination);
      return {
        result: {
          totalCount,
          edges,
          pageInfo,
        },
      };
    } catch (e) {
      console.error('searchJobPosts 에러 발생:', e);
      throw new RpcException('searchJobPosts 처리 중 에러 발생');
    }
  }
}
