import { Module } from '@nestjs/common';
import { JobApplyResolver } from './job-apply.resolver';
import { JobApplyService } from './grpc/job-apply.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [JobApplyResolver, JobApplyService],
})
export class JobApplyModule {}
