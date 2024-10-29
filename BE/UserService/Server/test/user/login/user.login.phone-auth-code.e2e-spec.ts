import * as request from 'supertest';
import { app, clearDatabase, setupTestingApp } from '../user.test-setup.util';
import { getUserDto1, signup } from '../user.utils';
import { INestApplication } from '@nestjs/common';
import { maxRequests } from './user.login.utils';

describe('로그인 휴대폰 인증번호 전송 요청 (e2e)', () => {
  beforeAll(async () => {
    await setupTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('휴대폰 인증번호 요청 성공', async () => {
    const userDto = getUserDto1();
    await signup(app, userDto);

    const phoneNumber = userDto.phoneNumber;

    await requestPhoneLoginAuthCode(app, phoneNumber);
  });

  it('잘못된 형식의 휴대폰 번호', async () => {
    const invalidPhoneNumber = '01112341234';

    await request(app.getHttpServer())
      .post('/api/users/login/phone-auth-code')
      .send({ phoneNumber: invalidPhoneNumber })
      .expect(400);
  });

  it('하루 최대 요청 횟수 초과', async () => {
    const userDto = getUserDto1();
    await signup(app, userDto);

    const phoneNumber = userDto.phoneNumber;
    let attempt = 1;

    for (; attempt < maxRequests; attempt++) {
      await requestPhoneLoginAuthCode(app, phoneNumber);
    }

    await request(app.getHttpServer())
      .post('/api/users/login/phone-auth-code')
      .send({ phoneNumber })
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty(
          'error',
          '하루 최대요청 횟수 초과',
        );
      });
  });

  it('존재하지 않는 사용자로 인증 요청', async () => {
    const nonExistentPhoneNumber = '01099999999';

    await request(app.getHttpServer())
      .post('/api/users/login/phone-auth-code')
      .send({ phoneNumber: nonExistentPhoneNumber })
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '존재하지 않는 사용자');
      });
  });
});

export function requestPhoneLoginAuthCode(
  app: INestApplication,
  phoneNumber: string,
) {
  return request(app.getHttpServer())
    .post('/api/users/login/phone-auth-code')
    .send({ phoneNumber })
    .expect(201)
    .expect((response) => {
      expect(response.body).toHaveProperty('remainingPhoneAuthenticationCount');
      expect(
        response.body.remainingPhoneAuthenticationCount,
      ).toBeLessThanOrEqual(maxRequests);
    });
}
