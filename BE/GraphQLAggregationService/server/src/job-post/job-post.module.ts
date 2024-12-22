import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostResolver } from './job-post.resolver';
import { JobPostService } from './grpc/job-post.service';
import { UserModule } from 'src/user/user.module';
import { JobApplyModule } from 'src/job-apply/job-apply.module';

@Module({
  imports: [ConfigModule, JobApplyModule, UserModule],
  providers: [JobPostResolver, JobPostService],
  exports: [JobPostService]
})
export class JobPostModule {}
