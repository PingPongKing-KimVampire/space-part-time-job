import * as request from 'supertest';
import {
  getUserDto1,
  getUserDto2,
  getUserSignupDto,
  requestPhoneAuthCode,
  signup,
} from './user.signup.utils';
import {
  app,
  clearDatabase,
  setupTestingApp,
} from './user.signup.test-setup.util';

describe('사용자 회원가입 (e2e)', () => {
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

  it('잘못된 형식(비밀번호 형식 오류)', async () => {
    const userDto1 = getUserDto1();
    userDto1.password = 'wrongPassword';

    const userSignupDto = getUserSignupDto(userDto1);
    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userSignupDto)
      .expect(400);
  });

  it('아이디 중복', async () => {
    const duplicateId = 'duplicateid';
    const userDto1 = getUserDto1();
    userDto1.id = duplicateId;

    await signup(app, userDto1);

    const userDto2 = getUserDto2();
    userDto2.id = duplicateId;
    await requestPhoneAuthCode(app, userDto2.phoneNumber);

    const userSignupDto = getUserSignupDto(userDto2);
    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userSignupDto)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '아이디 중복');
      });
  });

  it('닉네임 중복', async () => {
    const duplicateNick = 'dupnick';
    const userDto1 = getUserDto1();
    userDto1.nickname = duplicateNick;
    await signup(app, userDto1);

    const userDto2 = getUserDto2();
    userDto2.nickname = duplicateNick;
    await requestPhoneAuthCode(app, userDto2.phoneNumber);

    const userSignupDto = getUserSignupDto(userDto2);
    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userSignupDto)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '닉네임 중복');
      });
  });

  it('휴대폰 인증 실패', async () => {
    const userDto1 = getUserDto1();
    await requestPhoneAuthCode(app, userDto1.phoneNumber);

    const userSignupDto = getUserSignupDto(userDto1);
    const invalidSmsCode = '109182';
    userSignupDto.smsCode = invalidSmsCode;

    await request(app.getHttpServer())
      .post('/api/users')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(userSignupDto)
      .expect(401)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '휴대폰 인증 실패');
      });
  });
});
