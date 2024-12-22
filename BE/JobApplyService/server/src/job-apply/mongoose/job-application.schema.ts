import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JobApplicationDocument = HydratedDocument<JobApplication>;

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

@Schema({ timestamps: true })
export class JobApplication {
  _id: string;

  @Prop({ required: true })
  jobPostId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  coverLetter: string;

  @Prop({ required: true, enum: ApplicationStatus })
  status: ApplicationStatus;

  createdAt: Date;
  updatedAt: Date;

  static of(
    jobPostId: string,
    userId: string,
    coverLetter: string,
    status: ApplicationStatus,
  ) {
    const jobApplication = new JobApplication();
    jobApplication.jobPostId = jobPostId;
    jobApplication.userId = userId;
    jobApplication.coverLetter = coverLetter;
    jobApplication.status = status;
    return jobApplication;
  }
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
