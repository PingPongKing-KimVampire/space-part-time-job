import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobApplication,
  JobApplicationSchema,
} from './mongoose/job-application.schema';
import { JobApplyController } from './job-apply.controller';
import { JobApplyRepository } from './mongoose/job-apply.repository';
import { JobApplyService } from './job-apply.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobApplication.name,
        schema: JobApplicationSchema,
      },
    ]),
  ],
  controllers: [JobApplyController],
  providers: [JobApplyRepository, JobApplyService],
})
export class JobApplyModule {}
