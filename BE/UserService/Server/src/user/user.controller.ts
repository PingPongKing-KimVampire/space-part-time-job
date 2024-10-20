import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupRequestDto } from './dto/controller/signup.request.dto';
import { SignupDto } from './dto/service/signup.dto';
import { QueryFailedError } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @HttpCode(204)
  async signup(@Body() SignupRequestDto: SignupRequestDto) {
    const { id, password, nickname, phoneNumber, smsCode } = SignupRequestDto;
    try {
      await this.usersService.signup(
        SignupDto.of({
          id,
          password,
          nickname,
          phoneNumber,
          smsCode,
        }),
      );
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.includes('Duplicate entry')) {
          if (error.message.includes('UQ_USER_ID')) {
            throw new HttpException({ error: '아이디 중복' }, 409);
          }
          if (error.message.includes('UQ_NICKNAME')) {
            throw new HttpException({ error: '닉네임 중복' }, 409);
          }
          if (error.message.includes('UQ_PHONE_NUMBER')) {
            throw new HttpException({ error: '휴대폰 번호 중복' }, 409);
          }
          throw error;
        }
      }
      throw error;
    }
  }
}
