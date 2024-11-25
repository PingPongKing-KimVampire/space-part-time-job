import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobPostRepository } from '../mongoose/job-post.repository';
import { CreateJobPostInput } from './dto/job-post.input.dto';
import { Request } from 'express';
import { HttpException } from '@nestjs/common';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(
    private readonly jobPostService: JobPostRepository,
    private readonly imageUploadService: ImageUploadService,
  ) {}
  @Mutation()
  async createJobPost(
    @Args('input') input: CreateJobPostInput,
    @Context('req') req: Request,
  ) {
    const userDataHeader = req.headers['space-part-time-job-user-data-base64'];
    const userId = this.parseUserDataHeader(userDataHeader);

    const isValidImageUrl =
      await this.imageUploadService.areAllUserImageURLList(
        userId,
        input.photos,
      );

    if (!isValidImageUrl)
      throw new HttpException('유저가 업로드한 이미지 아님', 400);

    return this.jobPostService.createJobPost(input, userId);
  }

  private parseUserDataHeader(userData: string | string[] | undefined): string {
    try {
      const decodedData = Buffer.from(userData as string, 'base64').toString(
        'utf-8',
      );
      let user = JSON.parse(decodedData);
      const { id: userId } = user;
      return userId;
    } catch (e) {
      console.error(e);
      throw new HttpException('예상하지 못한 오류', 500);
    }
  }

  @Query()
  async getJobPost(@Args('id', { type: () => ID }) id: string) {
    return this.jobPostService.findById(id);
  }
}
