import { Module } from '@nestjs/common';
import { AuthTokenService } from './auth-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthTokenService],
  exports: [AuthTokenService],
  imports: [JwtModule, ConfigModule]
})
export class AuthTokenModule {}
