import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmsModule } from './sms/sms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), SmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
