import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartTimeJobModule } from './part-time-job/part-time-job.module';

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
    PartTimeJobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
