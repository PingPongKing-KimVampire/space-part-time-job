import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  InterestedJobPost,
  InterestedJobPostDocument,
} from './interested-job-post.schema';
import { Model } from 'mongoose';

@Injectable()
export class InterestedJobPostRepository {
  constructor(
    @InjectModel(InterestedJobPost.name)
    private interestedJobPostModel: Model<InterestedJobPostDocument>,
  ) {}

  async create(jobPostId: string, userId: string): Promise<InterestedJobPost> {
    const interestedJobPost = new this.interestedJobPostModel({
      jobPostId,
      userId,
    });
    const savedInterestedJobPost = await interestedJobPost.save();
    return savedInterestedJobPost.toObject();
  }

  async deleteByPostAndUser(
    jobPostId: string,
    userId: string,
  ): Promise<{ deletedCount: number }> {
    const result = await this.interestedJobPostModel
      .deleteOne({
        jobPostId,
        userId,
      })
      .exec();

    return { deletedCount: result.deletedCount || 0 };
  }

  async deleteById(id: string): Promise<{ deletedCount: number }> {
    const result = await this.interestedJobPostModel
      .deleteOne({
        _id: id,
      })
      .exec();
    return { deletedCount: result.deletedCount || 0 };
  }

  async getByUser(userId: string): Promise<InterestedJobPost[]> {
    const interestedJobPosts = await this.interestedJobPostModel
      .find({
        userId,
      })
      .lean()
      .exec();
    return interestedJobPosts;
  }

  async getByPostAndUser(
    jobPostId: string,
    userId: string,
  ): Promise<InterestedJobPost | null> {
    const interestedJobPost = await this.interestedJobPostModel
      .findOne({
        userId,
        jobPostId,
      })
      .lean()
      .exec();
    return interestedJobPost;
  }

  async countByPost(jobPostId: string): Promise<number> {
    const count = await this.interestedJobPostModel
      .countDocuments({ jobPostId })
      .exec();
    return count;
  }
}
