import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginPhoneAuthCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^010\d{8}$/, {
    message: '휴대폰 번호는 010으로 시작하는 11자리 숫자여야 합니다.',
  })
  phoneNumber: string;
}
