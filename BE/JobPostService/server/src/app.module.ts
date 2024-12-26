import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobPostModule } from './job-post/job-post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { RedisModule } from './redis/redis.module';
import { InterestedJobPostModule } from './interested-job-post/interested-job-post.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_HOST')}:${configService.get('MONGO_PORT')}/${configService.get('MONGO_DB')}`,
      }),
      inject: [ConfigService],
    }),
    JobPostModule,
    RedisModule,
    InterestedJobPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
