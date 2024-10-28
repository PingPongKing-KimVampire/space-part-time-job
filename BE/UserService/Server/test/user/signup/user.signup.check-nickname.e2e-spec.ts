import * as request from 'supertest';
import { getUserDto1, signup } from '../user.utils';
import {
  app,
  clearDatabase,
  setupTestingApp,
} from '../user.test-setup.util';

describe('닉네임 중복 체크 (e2e)', () => {
  beforeAll(async () => {
    await setupTestingApp();
  });

  beforeEach(async () => {
    await clearDatabase();
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
    await signup(app, userDto1);

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
