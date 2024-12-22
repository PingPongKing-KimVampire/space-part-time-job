import { forwardRef, Module } from '@nestjs/common';
import { JobApplyResolver } from './job-apply.resolver';
import { JobApplyService } from './grpc/job-apply.service';
import { ConfigModule } from '@nestjs/config';
import { JobPostModule } from 'src/job-post/job-post.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, forwardRef(() => JobPostModule), UserModule],
  providers: [JobApplyResolver, JobApplyService],
  exports: [JobApplyService],
})
export class JobApplyModule {}
