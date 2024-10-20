import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/service/signup.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  signup(signupDto: SignupDto): Promise<User> {
    const { id, password, nickname, phoneNumber } = signupDto;

    const user = User.of({
      userId: id,
      password,
      nickname,
      phoneNumber,
    });

    return this.usersRepository.save(user);
  }
}
