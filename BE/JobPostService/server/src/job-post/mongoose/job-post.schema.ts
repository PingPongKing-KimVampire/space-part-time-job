import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobPostDocument = JobPost & Document;

@Schema({ timestamps: true })
export class JobPost {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  jobDescription: string[];

  @Prop({
    type: {
      type: String,
      enum: ['SHORT_TERM', 'LONG_TERM'],
      required: true,
    },
    dates: [String],
    days: [String],
  })
  workPeriod: {
    type: 'SHORT_TERM' | 'LONG_TERM';
    dates?: string[];
    days?: string[];
  };

  @Prop({
    type: {
      type: String,
      enum: ['FLEXIBLE', 'FIXED'],
      required: true,
    },
    startTime: String,
    endTime: String,
  })
  workTime: {
    type: 'FLEXIBLE' | 'FIXED';
    startTime?: string;
    endTime?: string;
  };

  @Prop({
    type: {
      salaryType: {
        type: String,
        enum: ['HOURLY', 'PER_TASK', 'MONTHLY'],
        required: true,
      },
      salaryAmount: Number,
    },
    required: true,
  })
  salary: {
    salaryType: 'HOURLY' | 'PER_TASK' | 'MONTHLY';
    salaryAmount: number;
  };

  @Prop([String])
  photos: string[];

  @Prop({ required: true })
  detailedDescription: string;

  @Prop({ required: true })
  addressName: string;

  @Prop({ required: true })
  neighborhoodId: string;

  createdAt: Date;
  updatedAt: Date;
}

export const JobPostSchema = SchemaFactory.createForClass(JobPost);
