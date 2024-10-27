import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/producer/producer.service';
import { RedisService } from 'src/redis/redis.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class AuthCodeService {
  constructor(
    private readonly redisService: RedisService,
    private readonly utilService: UtilService,
    private readonly producerService: ProducerService,
  ) {}

  private readonly maxAttempts = 5;
  private readonly expirationTime = 60 * 5;
  private readonly codeLength = 6;

  async generateAndProduceAuthCode(
    phoneNumber: string,
    ipAddress: string,
  ): Promise<{ remainingPhoneAuthenticationCount: number }> {
    await this.checkAuthAttempts(ipAddress, phoneNumber);

    const authCode = await this.generateAndStoreAuthCode(phoneNumber);

    const secondUntilMidnight = this.utilService.getSecondUntilMidnight();
    await this.updateAuthAttempts(ipAddress, phoneNumber, secondUntilMidnight);

    await this.producerService.sendSignupPhoneAuthenticationMessage(
      phoneNumber,
      authCode,
    );

    const remainingPhoneAuthenticationCount = await this.getRemainingAttempts(
      ipAddress,
      phoneNumber,
    );

    return { remainingPhoneAuthenticationCount };
  }

  private async checkAuthAttempts(
    ipAddress: string,
    phoneNumber: string,
  ): Promise<void> {
    const [attemptsByIp, attemptsByPhoneNumber] = await Promise.all([
      this.getAuthAttemptByIp(ipAddress),
      this.getAuthAttemptByPhoneNumber(phoneNumber),
    ]);

    if (
      attemptsByIp >= this.maxAttempts ||
      attemptsByPhoneNumber >= this.maxAttempts
    ) {
      throw new Error('인증횟수 초과');
    }
  }

  private async generateAndStoreAuthCode(phoneNumber: string): Promise<string> {
    const authCode = this.utilService.generateRandomNumberCode(this.codeLength);
    await this.setAuthCode(phoneNumber, authCode);
    return authCode;
  }

  private async setAuthCode(
    phoneNumber: string,
    authCode: string,
  ): Promise<void> {
    const key = `authCode:${phoneNumber}`;
    await this.redisService.set(key, authCode, this.expirationTime);
  }

  private async updateAuthAttempts(
    ipAddress: string,
    phoneNumber: string,
    ttl: number,
  ): Promise<void> {
    await Promise.all([
      this.incrementAuthAttemptByIp(ipAddress, ttl),
      this.incrementAuthAttemptByPhoneNumber(phoneNumber, ttl),
    ]);
  }

  private async incrementAuthAttemptByIp(
    ipAddress: string,
    expiration: number,
  ): Promise<void> {
    const key = `phoneAuthAttemptByIp:${ipAddress}`;
    await this.redisService.incr(key);
    await this.redisService.expire(key, expiration);
  }

  private async incrementAuthAttemptByPhoneNumber(
    phoneNumber: string,
    expiration: number,
  ): Promise<void> {
    const key = `phoneAuthAttemptByPhoneNumber:${phoneNumber}`;
    await this.redisService.incr(key);
    await this.redisService.expire(key, expiration);
  }

  private async getRemainingAttempts(
    ipAddress: string,
    phoneNumber: string,
  ): Promise<number> {
    const [finalAttemptsByIp, finalAttemptsByPhoneNumber] = await Promise.all([
      this.getAuthAttemptByIp(ipAddress),
      this.getAuthAttemptByPhoneNumber(phoneNumber),
    ]);
    return this.calculateRemainingAttempts(
      finalAttemptsByIp,
      finalAttemptsByPhoneNumber,
      this.maxAttempts,
    );
  }

  private calculateRemainingAttempts(
    attemptsByIp: number,
    attemptsByPhoneNumber: number,
    maxAttempts: number,
  ): number {
    const maxAttemptsUsed = Math.max(attemptsByIp, attemptsByPhoneNumber);
    return maxAttempts - maxAttemptsUsed;
  }

  private async getAuthAttemptByIp(ipAddress: string): Promise<number> {
    const key = `phoneAuthAttemptByIp:${ipAddress}`;
    const count = await this.redisService.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  private async getAuthAttemptByPhoneNumber(
    phoneNumber: string,
  ): Promise<number> {
    const key = `phoneAuthAttemptByPhoneNumber:${phoneNumber}`;
    const count = await this.redisService.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  async verifyAuthCode(phoneNumber: string, authCode: string): Promise<void> {
    const storedCode = await this.getAuthCode(phoneNumber);
    if (!storedCode || storedCode !== authCode) {
      throw new Error('휴대폰 인증 실패');
    }
    await this.deleteAuthCode(phoneNumber);
  }

  private async getAuthCode(phoneNumber: string): Promise<string | null> {
    const key = `authCode:${phoneNumber}`;
    const code = await this.redisService.get(key);
    return code || null;
  }

  async deleteAuthCode(phoneNumber: string): Promise<void> {
    const key = `authCode:${phoneNumber}`;
    await this.redisService.del(key);
  }
}
