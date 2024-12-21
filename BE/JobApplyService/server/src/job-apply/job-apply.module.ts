import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JobApplication,
  JobApplicationSchema,
} from './mongoose/job-application.schema';
import { JobApplyController } from './job-apply.controller';

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
})
export class JobApplyModule {}
