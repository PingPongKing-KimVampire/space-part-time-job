import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { meResolver } from './user.resolver';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UserModule, UserService, meResolver],
})
export class UserModule {}
