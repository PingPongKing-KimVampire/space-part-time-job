import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const validSmsCode = '999999';

export function getUserDto1() {
  return {
    id: 'id123',
    password: 'Password123!',
    nickname: 'nick1',
    phoneNumber: '01012345678',
  };
}

export function getUserDto2() {
  return {
    id: 'id124',
    password: 'Password123!',
    nickname: 'nick2',
    phoneNumber: '01012345679',
  };
}

export async function signup(
  app: INestApplication,
  userDto: {
    id: string;
    password: string;
    nickname: string;
    phoneNumber: string;
  },
) {
  await requestPhoneAuthCode(app, userDto.phoneNumber);
  const userSignupDto = getUserSignupDto(userDto);
  return requestSignup(app, userSignupDto);
}

export function getUserSignupDto(userDto: {
  id: string;
  password: string;
  nickname: string;
  phoneNumber: string;
}) {
  const userSignupDto: any = structuredClone(userDto);
  const smsCode = validSmsCode;
  userSignupDto.smsCode = smsCode;
  return userSignupDto;
}

function requestSignup(
  app: INestApplication,
  userDto: {
    id: string;
    password: string;
    nickname: string;
    phoneNumber: string;
    smsCode: string;
  },
) {
  return request(app.getHttpServer())
    .post('/api/users')
    .set('Content-Type', 'application/json; charset=utf-8')
    .send(userDto)
    .expect(204);
}

export async function requestPhoneAuthCode(
  app: INestApplication,
  phoneNumber: string,
) {
  return request(app.getHttpServer())
    .post('/api/users/phone-auth-code')
    .set('Content-Type', 'application/json; charset=utf-8')
    .send({ phoneNumber })
    .expect(201);
}
