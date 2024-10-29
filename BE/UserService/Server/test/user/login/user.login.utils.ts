import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const maxRequests = 5;

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
