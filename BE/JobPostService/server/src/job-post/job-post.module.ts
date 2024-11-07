import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobPost, JobPostSchema } from './mongoose/job-post.schema';
import { JobPostRepository } from './mongoose/job-post.repository';
import { JobPostResolver } from './graphql/job-post.resolver';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: JobPost.name, schema: JobPostSchema }]),
    ConfigModule,
  ],
  providers: [JobPostRepository, JobPostResolver, UserService],
})
export class JobPostModule {}