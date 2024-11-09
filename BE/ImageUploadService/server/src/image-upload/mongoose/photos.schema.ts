import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Photo extends Document {
  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  photo_url: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
