import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { getUserDto1, requestSignup } from './user.utils';

describe('닉네임 중복 체크 (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('닉네임 사용 가능', async () => {
    const availableNickname = 'validnick';

    await request(app.getHttpServer())
      .get(`/api/users/check-nickname/${availableNickname}`)
      .expect(204);
  });

  it('닉네임 중복', async () => {
    const userDto1 = getUserDto1();
    await requestSignup(app, userDto1);

    const duplicateNickname = userDto1.nickname;
    await request(app.getHttpServer())
      .get(`/api/users/check-nickname/${duplicateNickname}`)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '닉네임 중복');
      });
  });

  it('잘못된 형식의 닉네임', async () => {
    const invalidNickname = 'invalid-nick!!';

    await request(app.getHttpServer())
      .get(`/api/users/check-nickname/${invalidNickname}`)
      .expect(400);
  });
});
