import { Module } from '@nestjs/common';
import { JobPostModule } from 'src/job-post/job-post.module';
import { TaskScheduleService } from './task-schedule.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [TaskScheduleService],
  imports: [JobPostModule, ScheduleModule.forRoot()],
})
export class TaskScheduleModule {}
