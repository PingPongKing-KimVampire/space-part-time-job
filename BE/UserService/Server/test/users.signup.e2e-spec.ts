import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { Repository } from 'typeorm';

describe('사용자 회원가입 (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  beforeEach(async () => {
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('성공', async () => {
    const userDto = getUserDto1();
    await requestSignup(userDto);
  });

  it('잘못된 형식(비밀번호 형식 오류)', async () => {
    const userDto1 = getUserDto1();
    userDto1.password = 'wrongPassword';

    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userDto1)
      .expect(400);
  });

  it('아이디 중복', async () => {
    const duplicateId = 'duplicateid';
    const userDto1 = getUserDto1();
    userDto1.id = duplicateId;

    await requestSignup(userDto1);

    const userDto2 = getUserDto2();
    userDto2.id = duplicateId;

    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userDto2)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '아이디 중복');
      });
  });

  it('닉네임 중복', async () => {
    const duplicateNick = 'dupnick';
    const userDto1 = getUserDto1();
    userDto1.nickname = duplicateNick;

    await requestSignup(userDto1);

    const userDto2 = getUserDto2();
    userDto2.nickname = duplicateNick;

    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userDto2)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '닉네임 중복');
      });
  });

  it('휴대폰 번호 중복', async () => {
    const duplicatePhoneNumber = '01012345678';
    const userDto1 = getUserDto1();
    userDto1.phoneNumber = duplicatePhoneNumber;

    await requestSignup(userDto1);

    const userDto2 = getUserDto2();
    userDto2.phoneNumber = duplicatePhoneNumber;

    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userDto2)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '휴대폰 번호 중복');
      });
  });

  function getUserDto1() {
    return {
      id: 'id123',
      password: 'Password123!',
      nickname: 'nick1',
      phoneNumber: '01012345678',
      smsCode: '123456',
    };
  }

  function getUserDto2() {
    return {
      id: 'id124',
      password: 'Password123!',
      nickname: 'nick2',
      phoneNumber: '01012345679',
      smsCode: '123456',
    };
  }

  function requestSignup(userDto: {
    id: string;
    password: string;
    nickname: string;
    phoneNumber: string;
    smsCode: string;
  }) {
    return request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userDto)
      .expect(204);
  }
});
