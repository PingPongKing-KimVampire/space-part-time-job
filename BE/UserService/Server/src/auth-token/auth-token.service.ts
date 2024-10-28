import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthTokenService {
  private readonly jwtAccessTokenExpiration = '7d';
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  generateAccessToken(payload: { id: string }): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.jwtAccessTokenExpiration,
      secret: this.jwtSecret,
    });
  }
  verifyAccessToken(token: string): { id: string } {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
  }
}
