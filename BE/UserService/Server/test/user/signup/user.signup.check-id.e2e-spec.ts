import * as request from 'supertest';
import { getUserDto1, signup } from './user.signup.utils';
import {
  app,
  clearDatabase,
  setupTestingApp,
} from './user.signup.test-setup.util';

describe('아이디 중복 체크 (e2e)', () => {
  beforeAll(async () => {
    await setupTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase();
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
    await signup(app, userDto1);

    const duplicateId = userDto1.id;
    await request(app.getHttpServer())
      .get(`/api/users/check-id/${duplicateId}`)
      .expect(409)
      .expect((response) => {
        expect(response.body).toHaveProperty('error', '아이디 중복');
      });
  });

  it('잘못된 형식의 아이디', async () => {
    const invalidId = 'invalid-id!!';

    await request(app.getHttpServer())
      .get(`/api/users/check-id/${invalidId}`)
      .expect(400);
  });
});
