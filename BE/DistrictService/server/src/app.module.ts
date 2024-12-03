import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DistrictModule } from './district/district.module';

@Module({
  imports: [DistrictModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
