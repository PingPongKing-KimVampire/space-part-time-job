import { Injectable } from '@nestjs/common';
import {
  ApplicationStatus,
  JobApplication,
  JobApplicationDocument,
} from './job-application.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JobApplyRepository {
  constructor(
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
  ) {}
  async createJobApplication(
    jobApplicationInput: JobApplication,
  ): Promise<JobApplication> {
    const jobApplication = new this.jobApplicationModel(jobApplicationInput);
    const savedJobApplication = await jobApplication.save();
    return savedJobApplication.toObject();
  }

  async listJobApplicationByUserAndPost(
    userId: string,
    jobPostId: string,
  ): Promise<JobApplication[]> {
    const filter = {
      userId,
      jobPostId,
    };

    const jobApplications = await this.jobApplicationModel.find(filter).exec();
    return jobApplications.map((doc) => doc.toObject());
  }

  async hasUserPendingApplicationByPost(
    userId: string,
    jobPostId: string,
  ): Promise<boolean> {
    const count = await this.jobApplicationModel.countDocuments({
      userId,
      jobPostId,
      status: ApplicationStatus.PENDING,
    });
    return count > 0;
  }

  async listJobApplicationByPost(jobPostId: string): Promise<JobApplication[]> {
    const filter = {
      jobPostId,
    };

    const jobApplications = await this.jobApplicationModel.find(filter).exec();
    return jobApplications.map((doc) => doc.toObject());
  }

  async listJobApplicationByUser(userId: string): Promise<JobApplication[]> {
    const filter = {
      userId,
    };

    const jobApplications = await this.jobApplicationModel.find(filter).exec();
    return jobApplications.map((doc) => doc.toObject());
  }

  async getJobApplication(id: string): Promise<JobApplication | null> {
    const jobApplication = await this.jobApplicationModel.findById(id).exec();
    if (!jobApplication) return null;
    return jobApplication.toObject();
  }

  async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
  ): Promise<JobApplication | null> {
    const updatedApplication = await this.jobApplicationModel.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true },
    );
    return updatedApplication ? updatedApplication.toObject() : null;
  }

  async countUnCancelJobApplicationByPost(jobPostId: string): Promise<number> {
    return this.jobApplicationModel
      .countDocuments({
        jobPostId,
        status: { $ne: ApplicationStatus.CANCELED },
      })
      .exec();
  }

  async rejectPendingApplications(jobPostId: string): Promise<number> {
    const result = await this.jobApplicationModel
      .updateMany(
        {
          jobPostId,
          status: ApplicationStatus.PENDING,
        },
        {
          $set: { status: ApplicationStatus.REJECTED },
        },
      )
      .exec();

    return result.modifiedCount;
  }
}
