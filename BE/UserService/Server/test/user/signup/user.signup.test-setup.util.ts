import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { UtilService } from 'src/util/util.service';
import { validSmsCode } from './user.signup.utils';

export let userRepository: Repository<User>;
export let redisService: RedisService;
export let app: INestApplication;

export async function setupTestingApp() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();

  userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  redisService = app.get<RedisService>(RedisService);

  const utilService = app.get<UtilService>(UtilService);
  jest
    .spyOn(utilService, 'generateRandomNumberCode')
    .mockReturnValue(validSmsCode);
}

export async function clearDatabase() {
  await userRepository.clear();
  await redisService.clearAll();
}
