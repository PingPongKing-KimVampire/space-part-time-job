import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobApplyService } from './grpc/job-apply.service';

@Module({
  imports: [ConfigModule],
  providers: [JobApplyService],
  exports: [JobApplyService],
})
export class JobApplyModule {}
