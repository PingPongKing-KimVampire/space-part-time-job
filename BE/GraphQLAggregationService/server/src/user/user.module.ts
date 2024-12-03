import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { meResolver } from './user.resolver';
import { ConfigModule } from '@nestjs/config';
import { DistrictModule } from 'src/district/district.module';

@Module({
  imports: [ConfigModule, DistrictModule],
  providers: [UserModule, UserService, meResolver],
})
export class UserModule {}
