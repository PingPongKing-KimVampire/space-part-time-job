import * as request from 'supertest';
import { app, clearDatabase, setupTestingApp } from '../user.test-setup.util';
import { getUserDto1, signup, validSmsCode } from '../user.utils';
import { requestPhoneLoginAuthCode } from './user.login.phone-auth-code.e2e-spec';

describe('휴대폰 인증번호 로그인 (e2e)', () => {
  beforeAll(async () => {
    await setupTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('로그인 성공', async () => {
    const userDto = getUserDto1();
    await signup(app, userDto);

    const phoneNumber = userDto.phoneNumber;
    await requestPhoneLoginAuthCode(app, phoneNumber);
    const smsCode = validSmsCode;

    const loginRequest = {
      phoneNumber,
      smsCode,
    };

    await request(app.getHttpServer())
      .post('/api/users/login/phone')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(loginRequest)
      .expect(201)
      .expect('set-cookie', /access_token=.*;/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  it('잘못된 형식으로 요청', async () => {
    const loginRequest = {
      phoneNumber: '011123112341',
      smsCode: '123123',
    };

    await request(app.getHttpServer())
      .post('/api/users/login/phone')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(loginRequest)
      .expect(400);
  });

  it('로그인 실패 (잘못된 인증번호)', async () => {
    const userDto = getUserDto1();
    await signup(app, userDto);

    const invalidSmsCode = '123123123';
    const loginRequest = {
      phoneNumber: userDto.phoneNumber,
      smsCode: invalidSmsCode,
    };

    await request(app.getHttpServer())
      .post('/api/users/login/phone')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(loginRequest)
      .expect(401)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '휴대폰 인증 실패');
      });
  });
});
