import * as request from 'supertest';
import { getUserDto1, signup } from '../user.utils';
import { app, clearDatabase, setupTestingApp } from '../user.test-setup.util';

describe('아이디/비밀번호 로그인 (e2e)', () => {
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

    const loginRequest = {
      id: userDto.id,
      password: userDto.password,
    };

    await request(app.getHttpServer())
      .post('/api/users/login')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(loginRequest)
      .expect(201)
      .expect('set-cookie', /access_token=.*;/)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  it('로그인 실패 (잘못된 비밀번호)', async () => {
    const userDto = getUserDto1();
    await signup(app, userDto);

    const loginRequest = {
      id: userDto.id,
      password: 'wrongPassword',
    };

    await request(app.getHttpServer())
      .post('/api/users/login')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(loginRequest)
      .expect(401)
      .expect((response) => {
        expect(response.body).toHaveProperty(
          'error',
          '아이디/패스워드 로그인 실패',
        );
      });
  });

  it('로그인 실패 (존재하지 않는 아이디)', async () => {
    const loginRequest = {
      id: 'invalidId',
      password: 'invalidPassword',
    };

    await request(app.getHttpServer())
      .post('/api/users/login')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(loginRequest)
      .expect(401)
      .expect((response) => {
        expect(response.body).toHaveProperty(
          'error',
          '아이디/패스워드 로그인 실패',
        );
      });
  });
});
