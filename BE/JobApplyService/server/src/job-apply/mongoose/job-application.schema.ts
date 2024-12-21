import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JobApplicationDocument = HydratedDocument<JobApplication>;

@Schema({ timestamps: true })
export class JobApplication {
  @Prop({ required: true })
  jobPostId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  coverLetter: string;

  createdAt: Date;
  updatedAt: Date;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
