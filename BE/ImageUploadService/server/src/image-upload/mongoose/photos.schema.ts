import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Photo extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  file_name: string;

  @Prop({ default: Date.now })
  uploaded_at: Date;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
