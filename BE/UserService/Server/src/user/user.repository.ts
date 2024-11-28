import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResidentDistrict } from './entities/user-resident-district.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserResidentDistrict)
    private usersResidentDistrictRepository: Repository<UserResidentDistrict>,
  ) {}

  async createUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async isUserIdExist(id: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { userId: id } });
    return count > 0;
  }

  async isNicknameExist(nickname: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { nickname } });
    return count > 0;
  }

  async isPhoneNumberExist(phoneNumber: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { phoneNumber } });
    return count > 0;
  }

  async findByUserId(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId },
    });
    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { phoneNumber },
    });
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    return user;
  }

  async findByIdWithResidentDistricts(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { residentDistricts: true },
    });
    return user;
  }

  async resetUserResidentDistricts(
    id: string,
    residentDistricts: UserResidentDistrict[],
  ) {
    await this.usersResidentDistrictRepository.delete({ userId: id });
    await this.usersResidentDistrictRepository.save(residentDistricts);
  }
}
