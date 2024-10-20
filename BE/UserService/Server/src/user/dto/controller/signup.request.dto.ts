import { IsNotEmpty, IsString, Validate } from 'class-validator';
import {
  IdValidator,
  PasswordValidator,
  NicknameValidator,
  PhoneNumberValidator,
  AuthNumberValidator,
} from '../../utils/CustomValidator';

export class SignupRequestDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IdValidator)
  id: string;

  @IsString()
  @IsNotEmpty()
  @Validate(PasswordValidator)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(NicknameValidator)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Validate(PhoneNumberValidator)
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Validate(AuthNumberValidator)
  smsCode: string;
}
