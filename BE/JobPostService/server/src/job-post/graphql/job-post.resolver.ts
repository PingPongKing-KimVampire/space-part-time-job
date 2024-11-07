import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JobPostRepository } from '../mongoose/job-post.repository';
import { CreateJobPostInput } from './dto/job-post.input.dto';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(private readonly jobPostService: JobPostRepository) {}
  @Mutation()
  async createJobPost(@Args('input') input: CreateJobPostInput) {
    const userId = 'tempId';
    return this.jobPostService.createJobPost(input, userId);
  }

  @Query()
  async getJobPost(@Args('id', { type: () => ID }) id: string) {
    return this.jobPostService.findById(id);
  }
}
