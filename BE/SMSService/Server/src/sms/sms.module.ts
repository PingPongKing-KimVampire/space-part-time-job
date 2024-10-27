import { Module } from '@nestjs/common';
import { SmsSenderService } from './sms-sender.service';
import { ConfigModule } from '@nestjs/config';
import { CoolSMSService } from './external-api/coolsms/sms.coolsms.service';

@Module({
  providers: [SmsSenderService, CoolSMSService],
  imports: [ConfigModule]
})
export class SmsModule {}
