import * as request from 'supertest';
import { getUserDto1, requestPhoneAuthCode, signup } from './user.signup.utils';
import {
  app,
  clearDatabase,
  setupTestingApp,
} from './user.signup.test-setup.util';

describe('휴대폰 인증 API (e2e)', () => {
  beforeAll(async () => {
    await setupTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('성공', async () => {
    const userDto = getUserDto1();
    await signup(app, userDto);
  });
  it('휴대폰 번호 인증 요청 성공', async () => {
    const validPhoneNumber = '01012341234';

    const response = await requestPhoneAuthCode(app, validPhoneNumber);
    expect(response.body).toHaveProperty('remainingPhoneAuthenticationCount');
    expect(response.body.remainingPhoneAuthenticationCount).toBeLessThanOrEqual(
      5,
    );
  });

  it('잘못된 형식의 휴대폰 번호', async () => {
    const invalidPhoneNumber = '01112341234';

    await request(app.getHttpServer())
      .post('/api/users/phone-auth-code')
      .send({ phoneNumber: invalidPhoneNumber })
      .expect(400);
  });

  it('하루 최대 요청 횟수 초과', async () => {
    const phoneNumber = '01012341234';
    const maxRequests = 5;

    for (let i = 0; i < maxRequests; i++) {
      await requestPhoneAuthCode(app, phoneNumber);
    }

    await request(app.getHttpServer())
      .post('/api/users/phone-auth-code')
      .send({ phoneNumber })
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty(
          'error',
          '하루 최대요청 횟수 초과',
        );
      });
  });

  it('전화번호 중복', async () => {
    const duplicatePhoneNumber = '01012341234';
    const userDto = getUserDto1();
    userDto.phoneNumber = duplicatePhoneNumber;

    await signup(app, userDto);

    await request(app.getHttpServer())
      .post('/api/users/phone-auth-code')
      .send({ phoneNumber: duplicatePhoneNumber })
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '전화번호 중복');
      });
  });
});
