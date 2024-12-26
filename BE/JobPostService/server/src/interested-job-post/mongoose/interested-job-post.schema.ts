import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InterestedJobPostDocument = HydratedDocument<InterestedJobPost>;

@Schema({ timestamps: true })
export class InterestedJobPost {
  _id: string;

  @Prop({ required: true })
  jobPostId: string;

  @Prop({ required: true })
  userId: string;

  createdAt: Date;
  updatedAt: Date;

  static of(jobPostId: string, userId: string): InterestedJobPost {
    const interestedJobPost = new InterestedJobPost();
    interestedJobPost.jobPostId = jobPostId;
    interestedJobPost.userId = userId;

    return interestedJobPost;
  }
}

export const InterestedJobPostSchema =
  SchemaFactory.createForClass(InterestedJobPost);
