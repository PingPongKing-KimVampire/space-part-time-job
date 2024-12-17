import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobPostResolver } from './job-post.resolver';
import { JobPostService } from './grpc/job-post.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [JobPostResolver, JobPostService],
})
export class JobPostModule {}
