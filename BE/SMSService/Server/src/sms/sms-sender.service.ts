import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer } from 'kafkajs';
import { CoolSMSService } from './external-api/coolsms/sms.coolsms.service';

@Injectable()
export class SmsSenderService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly coolSmsService: CoolSMSService,
  ) {}

  async onModuleInit() {
    const brokerAddress = this.configService.get<string>('KAFKA_BROKER');

    this.kafka = new Kafka({
      clientId: 'sms-consumer',
      brokers: [brokerAddress],
    });
    this.consumer = this.kafka.consumer({ groupId: 'sms-group' });
    await this.consumer.connect();

    const signupVerificationTopicName = 'signup-verification-topic';
    await this.consumer.subscribe({
      topic: signupVerificationTopicName,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        await this.sendAuthCodeMessage(data.phoneNumber, data.authCode);
      },
    });
  }

  private async sendAuthCodeMessage(phoneNumber: string, authCode: string) {
    const senderPhoneNumber = this.configService.get<string>(
      'SENDER_PHONE_NUMBER',
    );
    const SMS_MODE = this.configService.get<string>('SMS_MODE');
    const message = `[우주알바] 인증번호 [${authCode}]\n*타인에게 절대 알리지 마세요.(계정 도용 위험)`;
    if (SMS_MODE === 'DEV') {
      console.log(
        `${senderPhoneNumber} 번호로 ${phoneNumber}에게 인증문자가 발송되었습니다.`,
      );
      console.log(message);
    } else if (SMS_MODE === 'PRODUCTION') {
      this.coolSmsService.sendMessage(senderPhoneNumber, phoneNumber, message);
    }
  }
}
