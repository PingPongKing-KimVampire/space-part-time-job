import { Injectable } from '@nestjs/common';
import {
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
}
