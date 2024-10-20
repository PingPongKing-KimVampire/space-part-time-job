export class SignupDto {
  id: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  smsCode: string;
  static of({
    id,
    password,
    nickname,
    phoneNumber,
    smsCode,
  }: {
    id: string;
    password: string;
    nickname: string;
    phoneNumber: string;
    smsCode: string;
  }): SignupDto {
    const dto = new SignupDto();
    dto.id = id;
    dto.password = password;
    dto.nickname = nickname;
    dto.phoneNumber = phoneNumber;
    dto.smsCode = smsCode;
    return dto;
  }
}
