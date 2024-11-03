import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupRequestDto } from './dto/controller/signup.request.dto';
import { SignupDto } from './dto/service/signup.dto';
import { SignupPhoneAuthCodeRequestDto } from './dto/controller/signup-phone-auth-code.request.dto';
import { QueryFailedError } from 'typeorm';
import { IdValidator, NicknameValidator } from './utils/CustomValidator';
import { Request, Response } from 'express';
import { LoginRequestDto } from './dto/controller/login.request.dto';
import { AuthTokenService } from 'src/auth-token/auth-token.service';
import { LoginPhoneAuthCodeRequestDto } from './dto/controller/login-phone-auth-code.request.dto';
import { PhoneLoginRequestDto } from './dto/controller/login-phone.request.dto';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(
    private usersService: UserService,
    private readonly authTokenService: AuthTokenService,
  ) {}

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
      if (error.message === '휴대폰 인증 실패') {
        throw new HttpException({ error: '휴대폰 인증 실패' }, 401);
      }
      throw error;
      return;
    }
  }

  @Get('check-id/:id')
  @HttpCode(204)
  async checkUserId(@Param('id') id: string) {
    if (!IdValidator.isValidId(id)) {
      throw new HttpException({ error: IdValidator.errorMessage }, 400);
    }

    const isUserIdAvailable = await this.usersService.isUserIdAvailable(id);
    if (!isUserIdAvailable) {
      throw new HttpException({ error: '아이디 중복' }, 409);
    }
  }

  @Get('check-nickname/:nickname')
  @HttpCode(204)
  async checkNickname(@Param('nickname') nickname: string) {
    if (!NicknameValidator.isValidNickname(nickname)) {
      throw new HttpException({ error: NicknameValidator.errorMessage }, 400);
    }

    const isNicknameAvailable =
      await this.usersService.isNicknameAvailable(nickname);
    if (!isNicknameAvailable) {
      throw new HttpException({ error: '닉네임 중복' }, 409);
    }
  }

  @Post('phone-auth-code')
  async makeSignupPhoneAuthCode(
    @Body() phoneAuthCodeRequestDto: SignupPhoneAuthCodeRequestDto,
    @Req() req: Request,
  ) {
    const ip = req.ip;
    const { phoneNumber } = phoneAuthCodeRequestDto;
    let remainingPhoneAuthenticationCount: number;

    try {
      const result = await this.usersService.makeSignupPhoneAuthCode(
        phoneNumber,
        ip,
      );
      remainingPhoneAuthenticationCount =
        result.remainingPhoneAuthenticationCount;
    } catch (e) {
      if (e.message === '이미 가입된 휴대전화') {
        throw new HttpException({ error: '전화번호 중복' }, 409);
      } else if (e.message === '인증횟수 초과') {
        throw new HttpException({ error: '하루 최대요청 횟수 초과' }, 409);
      }
      throw new HttpException({ error: '알 수 없는 에러!' }, 500);
    }
    return { remainingPhoneAuthenticationCount };
  }

  @Post('login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id: userId, password } = loginRequestDto;
    try {
      const id = await this.usersService.getUserIdIfValid(userId, password);

      const accessToken = this.authTokenService.generateAccessToken({ id });
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        // secure: true, 추후 활성화
        sameSite: 'none', //추후 strict로 변경
      });

      return { id };
    } catch (e) {
      if (e.message === '존재하지 않는 회원') {
        throw new HttpException({ error: '아이디/패스워드 로그인 실패' }, 401);
      }
      throw new HttpException({ error: '알 수 없는 에러!' }, 500);
    }
  }

  @Post('login/phone')
  async phoneLogin(
    @Body() PhoneLoginRequestDto: PhoneLoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { phoneNumber, smsCode } = PhoneLoginRequestDto;
    try {
      const id = await this.usersService.getUserIdIfPhoneLoginValid(
        phoneNumber,
        smsCode,
      );

      const accessToken = this.authTokenService.generateAccessToken({ id });
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        // secure: true, 추후 활성화
        sameSite: 'none', //추후 strict로 변경
      });

      return { id };
    } catch (e) {
      if (e.message === '휴대폰 인증 실패') {
        throw new HttpException({ error: '휴대폰 인증 실패' }, 401);
      }
      throw new HttpException({ error: '알 수 없는 에러!' }, 500);
    }
  }

  @Post('login/phone-auth-code')
  async makeLoginPhoneAuthCode(
    @Body() loginPhoneAuthCodeRequestDto: LoginPhoneAuthCodeRequestDto,
    @Req() req: Request,
  ) {
    const ip = req.ip;
    const { phoneNumber } = loginPhoneAuthCodeRequestDto;
    let remainingPhoneAuthenticationCount: number;

    try {
      const result = await this.usersService.makeLoginPhoneAuthCode(
        phoneNumber,
        ip,
      );
      remainingPhoneAuthenticationCount =
        result.remainingPhoneAuthenticationCount;
    } catch (e) {
      if (e.message === '가입되지 않은 전화번호') {
        throw new HttpException({ error: '존재하지 않는 사용자' }, 409);
      } else if (e.message === '인증횟수 초과') {
        throw new HttpException({ error: '하루 최대요청 횟수 초과' }, 409);
      }
      throw new HttpException({ error: '알 수 없는 에러!' }, 500);
    }
    return { remainingPhoneAuthenticationCount };
  }

  @GrpcMethod('AuthService', 'AuthenticateUser')
  authenticateUserByToken(data: { token: string }): { id: string } {
    try {
      const { id } = this.authTokenService.verifyAccessToken(data.token);
      return { id };
    } catch (e) {
      throw new RpcException('유저 인증 실패');
    }
  }
}
