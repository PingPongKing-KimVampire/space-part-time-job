import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPost, JobPostSchema } from './mongoose/job-post.schema';
import { JobPostRepository } from './mongoose/job-post.repository';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JobPostController } from './job-post.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobPost.name, schema: JobPostSchema }]),
    ConfigModule,
  ],
  providers: [JobPostRepository, ImageUploadService],
  controllers: [JobPostController],
})
export class JobPostModule {}
