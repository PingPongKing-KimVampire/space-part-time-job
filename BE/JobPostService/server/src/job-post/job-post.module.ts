import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPost, JobPostSchema } from './mongoose/job-post.schema';
import { JobPostRepository } from './mongoose/job-post.repository';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobPost.name, schema: JobPostSchema }]),
    ConfigModule,
    RedisModule,
  ],
  providers: [JobPostRepository, ImageUploadService, JobPostService],
  controllers: [JobPostController],
})
export class JobPostModule {}
