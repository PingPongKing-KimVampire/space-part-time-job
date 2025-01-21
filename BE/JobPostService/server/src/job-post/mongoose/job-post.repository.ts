import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobPost, JobPostDocument, JobPostStatus } from './job-post.schema';
import { SearchJobPostsInput } from '../grpc/dto/search-job-posts/search-job-posts.input.dto';
import { WorkPeriodType, WorkTimeType } from './job-post.enum';

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
    return this.jobPostModel.findById(id).lean().exec();
  }

  async findAll(): Promise<JobPost[]> {
    return this.jobPostModel.find().exec();
  }

  async searchJobPosts(
    filters: SearchJobPostsInput['filters'],
    pagination: SearchJobPostsInput['pagination'],
    userId: string,
  ): Promise<{
    totalCount: number;
    edges: { cursor: string; node: JobPost }[];
    pageInfo: { hasNextPage: boolean; endCursor: string };
  }> {
    const query = this.getQueryByFilter(filters, userId);
    const results = await this.getResultsByQueryAndPagination(
      query,
      pagination,
    );

    const totalCount = await this.jobPostModel.countDocuments({
      ...query,
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

  private getQueryByFilter(
    filters: SearchJobPostsInput['filters'],
    userId: string,
  ) {
    const query: any = {};
    if (filters.neighborhoodIds) {
      query.neighborhoodId = { $in: filters.neighborhoodIds };
    }
    if (filters.jobCategories) {
      query.jobCategories = { $in: filters.jobCategories };
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
      const timeCondition = [];
      timeCondition.push({ 'workTime.type': WorkTimeType.FLEXIBLE });

      if (filters.startTime <= filters.endTime) {
        const andCondition = [
          { 'workTime.startTime': { $gte: filters.startTime } },
          { 'workTime.endTime': { $lte: filters.endTime } },
          {
            $expr: {
              $lte: ['$workTime.startTime', '$workTime.endTime'],
            },
          },
        ];
        timeCondition.push({ $and: andCondition });
      } else if (filters.startTime > filters.endTime) {
        const orCondition = [
          {
            $and: [
              { 'workTime.startTime': { $lte: filters.endTime } },
              { 'workTime.endTime': { $lte: filters.endTime } },
              {
                $expr: {
                  $lte: ['$workTime.startTime', '$workTime.endTime'],
                },
              },
            ],
          },
          {
            $and: [
              { 'workTime.startTime': { $gte: filters.startTime } },
              { 'workTime.endTime': { $gte: filters.startTime } },
              {
                $expr: {
                  $lte: ['$workTime.startTime', '$workTime.endTime'],
                },
              },
            ],
          },
          {
            $and: [
              { 'workTime.startTime': { $gte: filters.startTime } },
              { 'workTime.endTime': { $lte: filters.endTime } },
            ],
          },
        ];
        timeCondition.push({ $or: orCondition });
      }
      if (!query.$and) query.$and = [];
      query.$and.push({ $or: timeCondition });
    }
    if (filters.keyword) {
      const condition = [
        { title: { $regex: filters.keyword, $options: 'i' } },
        { detailedDescription: { $regex: filters.keyword, $options: 'i' } },
      ];
      if (!query.$or) {
        query.$or = [];
      }
      query.$or = query.$or.concat(condition);
    }
    if (filters.onlyMyPosts) {
      query.userId = userId;
    }
    if (filters.status && filters.status.length) {
      query.status = { $in: filters.status };
    }

    return query;
  }

  private async getResultsByQueryAndPagination(
    query: any,
    pagination: SearchJobPostsInput['pagination'],
  ) {
    const andConditions: any[] = [];
    andConditions.push(query);

    if (pagination.afterCursor) {
      const cursorJobPost = await this.jobPostModel.findOne({
        _id: pagination.afterCursor,
      });

      const cursorFilter = {
        $or: [
          { createdAt: { $lt: cursorJobPost.createdAt } },
          {
            createdAt: cursorJobPost.createdAt,
            _id: { $lt: cursorJobPost._id },
          },
        ],
      };
      andConditions.push(cursorFilter);
    }

    const finalQuery = { $and: andConditions };
    const limit = pagination.first;
    const results = await this.jobPostModel
      .find(finalQuery)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();
    return results;
  }

  async incrementViews(jobPostId: string): Promise<{ views: number }> {
    try {
      const result = await this.jobPostModel.findByIdAndUpdate(
        jobPostId,
        { $inc: { views: 1 } },
        { new: true },
      );
      if (!result) {
        throw new Error(
          `${jobPostId}이 아이디인 아르바이트 공고가 없어 조회수 증가 실패`,
        );
      }
      return { views: result.views };
    } catch (error) {
      console.error(`조회수 증가 실패`, error);
      throw error;
    }
  }

  async updateStatus(
    jobPostId: string,
    status: JobPostStatus,
  ): Promise<JobPost> {
    const updatedJobPost = await this.jobPostModel
      .findByIdAndUpdate(jobPostId, { status }, { new: true })
      .lean()
      .exec();
    if (!updatedJobPost) {
      throw new Error(`존재하지 않는 공고임`);
    }
    return updatedJobPost;
  }

  async closeExpiredShortTermJobPosts(today: string): Promise<JobPost[]> {
    const filter = {
      'workPeriod.type': 'SHORT_TERM',
      status: JobPostStatus.OPEN,
    };

    const expiredCandidateJobPosts = await this.jobPostModel
      .find(filter)
      .lean()
      .exec();

    const jobPostsToUpdate = expiredCandidateJobPosts.filter((jobPost) => {
      const maxDate = jobPost.workPeriod.dates.reduce((acc, date) => {
        const ret = acc >= date ? acc : date;
        return ret;
      }, '0000-00-00');
      return maxDate < today;
    });

    if (jobPostsToUpdate.length === 0) {
      return [];
    }

    const jobPostIdsToUpdate = jobPostsToUpdate.map((jobPost) => jobPost._id);
    await this.jobPostModel
      .updateMany(
        { _id: { $in: jobPostIdsToUpdate } },
        { $set: { status: JobPostStatus.CLOSE } },
      )
      .exec();

    return jobPostsToUpdate;
  }
}
