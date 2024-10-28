import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/service/signup.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthCodeService } from 'src/user/auth-code/auth-code.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authCodeService: AuthCodeService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { id, password, nickname, phoneNumber, smsCode } = signupDto;
    await this.authCodeService.verifyAuthCode(phoneNumber, smsCode);

    const user = User.of({
      userId: id,
      password,
      nickname,
      phoneNumber,
    });
    return this.userRepository.createUser(user);
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

  async getUserIdIfValid(userId: string, password: string): Promise<string> {
    const user = await this.userRepository.findByIdAndPassword(
      userId,
      password,
    );
    if (!user) throw new Error('존재하지 않는 회원');
    return user.id;
  }
}
