import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UtilModule } from 'src/util/util.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthCodeService } from './auth-code/auth-code.service';
import { ProducerModule } from 'src/producer/producer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilModule, RedisModule, ProducerModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthCodeService],
})
export class UsersModule {}
