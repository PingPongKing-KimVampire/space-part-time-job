import { MongooseModule } from '@nestjs/mongoose';
import {
  InterestedJobPost,
  InterestedJobPostSchema,
} from './mongoose/interested-job-post.schema';
import { Module } from '@nestjs/common';
import { InterestedJobPostRepository } from './mongoose/interested-job-post.repository';
import { InterestedJobPostService } from './interested-job-post.service';
import { JobPostModule } from 'src/job-post/job-post.module';
import { InterestedJobPostController } from './interested-job-post.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterestedJobPost.name, schema: InterestedJobPostSchema },
    ]),
    JobPostModule,
  ],
  providers: [InterestedJobPostRepository, InterestedJobPostService],
  controllers: [InterestedJobPostController],
})
export class InterestedJobPostModule {}
