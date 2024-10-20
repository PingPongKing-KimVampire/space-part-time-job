import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/service/signup.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  signup(signupDto: SignupDto): Promise<User> {
    const { id, password, nickname, phoneNumber } = signupDto;

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
    if (isExist) return false;
    return true;
  }
}
