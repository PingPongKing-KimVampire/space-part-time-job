import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JobPostRepository } from './mongoose/job-post.repository';
import { CreateJobPostInput } from './grpc/dto/job-post.input.dto';

import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller()
export class JobPostController {
  constructor(
    private readonly jobPostRepository: JobPostRepository,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @GrpcMethod('JobPostService', 'CreateJobPost')
  async createJobPost(input: any): Promise<{ id: string }> {
    input = plainToInstance(CreateJobPostInput, input);
    await this.validateFormat(input);
    await this.validateImageUrl(input);

    try {
      const createdJobPost = await this.jobPostRepository.createJobPost(input);
      return { id: createdJobPost.id };
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
}
