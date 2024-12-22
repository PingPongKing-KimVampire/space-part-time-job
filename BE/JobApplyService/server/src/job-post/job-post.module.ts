import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostService } from './grpc/job-post.service';

@Module({
  imports: [ConfigModule],
  providers: [JobPostService],
  exports: [JobPostService],
})
export class JobPostModule {}
