import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPost, JobPostSchema } from './mongoose/job-post.schema';
import { JobPostRepository } from './mongoose/job-post.repository';
import { JobPostResolver } from './graphql/job-post.resolver';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadService } from 'src/image-upload/image-upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobPost.name, schema: JobPostSchema }]),
    ConfigModule,
  ],
  providers: [JobPostRepository, JobPostResolver, ImageUploadService],
})
export class JobPostModule {}