import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostResolver } from './job-post.resolver';
import { JobPostService } from './grpc/job-post.service';

@Module({
  imports: [ConfigModule],
  providers: [JobPostResolver, JobPostService],
})
export class JobPostModule {}
