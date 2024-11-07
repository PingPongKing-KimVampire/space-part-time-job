import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobPost, JobPostDocument } from './job-post.schema';

@Injectable()
export class JobPostRepository {
  constructor(
    @InjectModel(JobPost.name) private jobPostModel: Model<JobPostDocument>,
  ) {}

  async createJobPost(input: any, userId: string) {
    const jobPost = new this.jobPostModel({ ...input, userId });
    return jobPost.save();
  }

  async findById(id: string): Promise<JobPost | null> {
    return this.jobPostModel.findById(id).exec();
  }

  async findAll(): Promise<JobPost[]> {	
    return this.jobPostModel.find().exec();
  }
}
