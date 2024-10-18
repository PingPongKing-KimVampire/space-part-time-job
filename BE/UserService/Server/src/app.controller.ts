import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import Redis from 'ioredis';

@Controller()
export class AppController implements OnModuleInit {
  private redisClient: Redis;
  constructor(private readonly appService: AppService) {}
  onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    // Redis 연결 확인
    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  @Get()
  async getHello() {
    await this.testRedisConnection();
    return this.appService.getHello();
  }

  async testRedisConnection() {
    try {
      await this.redisClient.set('test-key', 'test-value');
      const value = await this.redisClient.get('test-key');
      console.log('Redis value:', value);
      return value;
    } catch (error) {
      console.error('Error accessing Redis:', error);
      throw error;
    }
  }
}
