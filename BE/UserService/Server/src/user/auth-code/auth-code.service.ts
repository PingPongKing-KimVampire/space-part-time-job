import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { UtilService } from 'src/util/util.service';
// import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class AuthCodeService {
  constructor(
    private readonly redisService: RedisService,
    private readonly utilService: UtilService,
    // private readonly kafkaService: KafkaService,
  ) {}

  private readonly maxAttempts = 5;
  private readonly expirationTime = 60 * 5;

  async handleAuthCodeProcess(
    phoneNumber: string,
    ipAddress: string,
  ): Promise<{ remainingPhoneAuthenticationCount: number }> {
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

    const codeLength = 6;
    const authCode = this.utilService.generateRandomNumberCode(codeLength);
    await this.redisService.set(phoneNumber, authCode, this.expirationTime);

    const secondUntilMidnight = this.utilService.getSecondUntilMidnight();
    await this.incrementAuthAttemptByIp(ipAddress, secondUntilMidnight);
    await this.incrementAuthAttemptByPhoneNumber(
      phoneNumber,
      secondUntilMidnight,
    );

    // 카프카에 인증 코드 이벤트 로깅
    // this.kafkaService.saveAuthEvent(phoneNumber, ipAddress, authCode);

    const [finalAttemptsByIp, finalAttemptsByPhoneNumber] = await Promise.all([
      this.getAuthAttemptByIp(ipAddress),
      this.getAuthAttemptByPhoneNumber(phoneNumber),
    ]);

    const remainingPhoneAuthenticationCount = this.calculateRemainingAttempts(
      finalAttemptsByIp,
      finalAttemptsByPhoneNumber,
      this.maxAttempts,
    );

    return { remainingPhoneAuthenticationCount };
  }

  private calculateRemainingAttempts(
    attemptsByIp: number,
    attemptsByPhoneNumber: number,
    maxAttempts: number,
  ): number {
    const maxAttemptsUsed = Math.max(attemptsByIp, attemptsByPhoneNumber);
    return maxAttempts - maxAttemptsUsed;
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

  async getAuthAttemptByIp(ipAddress: string): Promise<number> {
    const key = `phoneAuthAttemptByIp:${ipAddress}`;
    const count = await this.redisService.get(key);
    return count ? parseInt(count, 10) : 0;
  }

  async getAuthAttemptByPhoneNumber(phoneNumber: string): Promise<number> {
    const key = `phoneAuthAttemptByPhoneNumber:${phoneNumber}`;
    const count = await this.redisService.get(key);
    return count ? parseInt(count, 10) : 0;
  }
}
