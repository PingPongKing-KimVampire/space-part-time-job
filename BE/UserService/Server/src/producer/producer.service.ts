import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const brokerAddress = this.configService.get<string>('KAFKA_BROKER');

    this.kafka = new Kafka({
      brokers: [brokerAddress],
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async sendSignupPhoneAuthenticationMessage(
    phoneNumber: string,
    authCode: string,
  ) {
    const message = { phoneNumber, authCode };

    await this.producer.send({
      topic: 'signup-verification-topic',
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
