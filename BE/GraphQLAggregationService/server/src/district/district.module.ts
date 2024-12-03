import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DistrictService } from './district.service';

@Module({
  imports: [ConfigModule],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
