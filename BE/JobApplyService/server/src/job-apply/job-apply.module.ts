import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobApplication,
  JobApplicationSchema,
} from './mongoose/job-application.schema';
import { JobApplyController } from './job-apply.controller';
import { JobApplyRepository } from './mongoose/job-apply.repository';
import { JobApplyService } from './job-apply.service';
import { JobPostModule } from 'src/job-post/job-post.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobApplication.name,
        schema: JobApplicationSchema,
      },
    ]),
    JobPostModule,
  ],
  controllers: [JobApplyController],
  providers: [JobApplyRepository, JobApplyService],
})
export class JobApplyModule {}
