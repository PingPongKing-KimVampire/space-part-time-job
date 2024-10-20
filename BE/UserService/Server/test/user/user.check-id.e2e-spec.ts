import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { getUserDto1, requestSignup } from './user.utils';

describe('아이디 중복 체크 (e2e)', () => {
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

  it('아이디 사용 가능', async () => {
    const availableId = 'id123';

    await request(app.getHttpServer())
      .get(`/api/users/check-id/${availableId}`)
      .expect(204);
  });

  it('아이디 중복', async () => {
    const userDto1 = getUserDto1();
    await requestSignup(app, userDto1);

    const duplicateId = userDto1.id;
    await request(app.getHttpServer())
      .get(`/api/users/check-id/${duplicateId}`)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '휴대폰 번호 중복');
      });
  });

  it('잘못된 형식의 아이디', async () => {
    const invalidId = 'invalid-id!!';

    await request(app.getHttpServer())
      .get(`/api/users/check-id/${invalidId}`)
      .expect(400);
  });
});
