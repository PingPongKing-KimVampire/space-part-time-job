import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ProducerService],
  exports: [ProducerService],
  imports: [ConfigModule],
})
export class ProducerModule {}
