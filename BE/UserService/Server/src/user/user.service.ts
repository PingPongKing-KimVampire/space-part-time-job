import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/service/signup.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthCodeService } from 'src/user/auth-code/auth-code.service';
import * as bcrypt from 'bcrypt';
import { UserResidentDistrict } from './entities/user-resident-district.entity';
import { DistrictService } from 'src/district/district.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCodeService: AuthCodeService,
    private readonly districtService: DistrictService,
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

  async getUserPublicInfo(
    id: string,
  ): Promise<{ id: string; nickname: string; createdAt: Date }> {
    const user = await this.userRepository.findById(id);
    return { id: user.id, nickname: user.nickname, createdAt: user.createdAt };
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

  async findByIdWithResidentDistricts(
    id: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findByIdWithResidentDistricts(id);
    if (!user) throw new Error('존재하지 않는 회원');
    delete user.password;
    return user;
  }

  async resetUserResidentDistricts(
    id: string,
    residentDistricts: { id: string; level: number }[],
  ) {
    await this.checkDistricts(
      residentDistricts.map((residentDistrict) => residentDistrict.id),
    );
    const userResidentDistricts = residentDistricts.map((residentDistrict) =>
      UserResidentDistrict.of(id, residentDistrict.id, residentDistrict.level),
    );
    await this.userRepository.resetUserResidentDistricts(
      id,
      userResidentDistricts,
    );
  }

  private async checkDistricts(districts: string[]) {
    //행정동 이름 조회 실패시 throw됨
    await this.districtService.getDistrictNames(districts);
  }
}
