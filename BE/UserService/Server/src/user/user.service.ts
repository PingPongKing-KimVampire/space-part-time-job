import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/service/signup.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthCodeService } from 'src/user/auth-code/auth-code.service';
import * as bcrypt from 'bcrypt';
import { UserResidentDistrict } from './entities/user-resident-district.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCodeService: AuthCodeService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { id, password, nickname, phoneNumber, smsCode } = signupDto;
    await this.authCodeService.verifyAuthCode(phoneNumber, smsCode);

    const hashedPassword = await this.saltAndHashPassword(password);

    const user = User.of({
      userId: id,
      password: hashedPassword,
      nickname,
      phoneNumber,
    });
    return this.userRepository.createUser(user);
  }

  private async saltAndHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  async isUserIdAvailable(id: string): Promise<boolean> {
    const isExist = await this.userRepository.isUserIdExist(id);
    return !isExist;
  }

  async isNicknameAvailable(nickname: string): Promise<boolean> {
    const isExist = await this.userRepository.isNicknameExist(nickname);
    return !isExist;
  }

  async makeSignupPhoneAuthCode(
    phoneNumber: string,
    ipAddress: string,
  ): Promise<{ remainingPhoneAuthenticationCount: number }> {
    const isExist = await this.userRepository.isPhoneNumberExist(phoneNumber);
    if (isExist) throw new Error('이미 가입된 휴대전화');

    const { remainingPhoneAuthenticationCount } =
      await this.authCodeService.generateAndProduceAuthCode(
        phoneNumber,
        ipAddress,
      );
    return { remainingPhoneAuthenticationCount };
  }

  async makeLoginPhoneAuthCode(
    phoneNumber: string,
    ipAddress: string,
  ): Promise<{ remainingPhoneAuthenticationCount: number }> {
    const isExist = await this.userRepository.isPhoneNumberExist(phoneNumber);
    if (!isExist) throw new Error('가입되지 않은 전화번호');

    const { remainingPhoneAuthenticationCount } =
      await this.authCodeService.generateAndProduceAuthCode(
        phoneNumber,
        ipAddress,
      );
    return { remainingPhoneAuthenticationCount };
  }

  async getUserIdIfValid(userId: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUserId(userId);
    if (!user || !(await this.verifyPassword(password, user.password))) {
      throw new Error('존재하지 않는 회원');
    }
    return user.id;
  }

  private async verifyPassword(
    password: string,
    savedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, savedPassword);
  }

  async getUserIdIfPhoneLoginValid(
    phoneNumber: string,
    smsCode: string,
  ): Promise<string> {
    await this.authCodeService.verifyAuthCode(phoneNumber, smsCode);

    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    if (!user) throw new Error('존재하지 않는 회원');
    return user.id;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('존재하지 않는 회원');
    delete user.password;
    return user;
  }

  async resetUserResidentDistricts(id: string, districts: string[]) {
    //districts에 대한 검증 추가하기
    const residentDistricts = districts.map((district) =>
      UserResidentDistrict.of(id, district),
    );
    await this.userRepository.resetUserResidentDistricts(id, residentDistricts);
  }
}
