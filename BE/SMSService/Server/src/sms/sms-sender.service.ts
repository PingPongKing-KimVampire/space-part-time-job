import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class SmsSenderService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  async onModuleInit() {
  }

}
