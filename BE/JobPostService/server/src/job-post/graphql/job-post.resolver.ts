import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobPostRepository } from '../mongoose/job-post.repository';
import { CreateJobPostInput } from './dto/job-post.input.dto';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { HttpException } from '@nestjs/common';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(
    private readonly jobPostService: JobPostRepository,
    private readonly userService: UserService,
  ) {}
  @Mutation()
  async createJobPost(
    @Args('input') input: CreateJobPostInput,
    @Context('req') req: Request,
  ) {
    const accessToken = req.cookies.access_token;
    let userId: string;
    if (!accessToken) throw new HttpException('토큰 없음', 401);
    try {
      const { id } = await this.userService.authenticateUser(
        req.cookies.access_token,
      );
      userId = id;
    } catch (e) {
      if (e.message === '유저 인증 실패')
        throw new HttpException('유저 인증 실패', 401);
      throw e;
    }
    return this.jobPostService.createJobPost(input, userId);
  }

  @Query()
  async getJobPost(@Args('id', { type: () => ID }) id: string) {
    return this.jobPostService.findById(id);
  }
}
