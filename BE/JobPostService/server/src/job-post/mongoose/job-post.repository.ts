import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobPost, JobPostDocument } from './job-post.schema';
import { SearchJobPostsInput } from '../grpc/dto/search-job-posts/search-job-posts.input.dto';
import { WorkPeriodType } from './job-post.enum';

@Injectable()
export class JobPostRepository {
  constructor(
    @InjectModel(JobPost.name) private jobPostModel: Model<JobPostDocument>,
  ) {}

  async createJobPost(input: any) {
    const jobPost = new this.jobPostModel(input);
    return jobPost.save();
  }

  async findById(id: string): Promise<JobPost | null> {
    return this.jobPostModel.findById(id).exec();
  }

  async findAll(): Promise<JobPost[]> {
    return this.jobPostModel.find().exec();
  }

  async searchJobPosts(
    filters: SearchJobPostsInput['filters'],
    pagination: SearchJobPostsInput['pagination'],
  ): Promise<{
    totalCount: number;
    edges: { cursor: string; node: JobPost }[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  }> {
    const query = this.getQueryByFilter(filters);
    const results = await this.getResultsByQueryAndPagination(
      query,
      pagination,
    );

    const cursorFilter = pagination.afterCursor
      ? { _id: { $gt: pagination.afterCursor } }
      : {};

    const totalCount = await this.jobPostModel.countDocuments({
      ...query,
      ...cursorFilter,
    });

    const edges = results.map((jobPost) => {
      jobPost.id = jobPost._id;
      return {
        cursor: jobPost._id.toString(),
        node: jobPost,
      };
    });

    const limit = pagination.first;
    const hasNextPage = results.length === limit;
    const endCursor = results.length
      ? results[results.length - 1]._id.toString()
      : null;

    return { totalCount, edges, pageInfo: { hasNextPage, endCursor } };
  }

  private getQueryByFilter(filters: SearchJobPostsInput['filters']) {
    const query: any = {};
    if (filters.neighborhoodIds) {
      query.neighborhoodId = { $in: filters.neighborhoodIds };
    }
    if (filters.jobCategories) {
      query.jobDescription = { $in: filters.jobCategories };
    }
    if (filters.workPeriodType === WorkPeriodType.SHORT_TERM) {
      query['workPeriod.type'] = filters.workPeriodType;
    } else if (filters.workPeriodType === WorkPeriodType.LONG_TERM) {
      query['workPeriod.type'] = filters.workPeriodType;
      if (filters.days) {
        query['workPeriod.days'] = { $all: filters.days };
      }
    }
    if (filters.startTime && filters.endTime) {
      if (filters.startTime <= filters.endTime) {
        query.$and = [
          { 'workTime.startTime': { $gte: filters.startTime } },
          { 'workTime.endTime': { $lte: filters.endTime } },
          {
            $expr: {
              $lt: ['$workTime.startTime', '$workTime.endTime'],
            },
          },
        ];
      } else if (filters.startTime > filters.endTime) {
        query.$or = [
          {
            $and: [
              { 'workTime.startTime': { $lte: filters.endTime } },
              { 'workTime.endTime': { $lte: filters.endTime } },
            ],
          },
          {
            $and: [
              { 'workTime.startTime': { $gte: filters.startTime } },
              { 'workTime.endTime': { $gte: filters.startTime } },
            ],
          },
          {
            $and: [
              { 'workTime.startTime': { $gte: filters.startTime } },
              { 'workTime.endTime': { $lte: filters.endTime } },
            ],
          },
        ];
      }
    }
    return query;
  }

  private async getResultsByQueryAndPagination(
    query: any,
    pagination: SearchJobPostsInput['pagination'],
  ) {
    const limit = pagination.first;
    const cursorFilter = pagination.afterCursor
      ? { _id: { $gt: pagination.afterCursor } }
      : {};

    const results = await this.jobPostModel
      .find({ ...query, ...cursorFilter })
      .sort({ _id: 1 })
      .limit(limit)
      .lean();
    return results;
  }
}
