import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { User } from './user/entities/user.entity';
import { UtilModule } from './util/util.module';
import { RedisModule } from './redis/redis.module';
import { ProducerModule } from './producer/producer.module';
import { AuthTokenModule } from './auth-token/auth-token.module';
import { UserResidentDistrict } from './user/entities/user-resident-district.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DB'),
        entities: [User, UserResidentDistrict],
        synchronize: true, //운영환경에서는 false가 되어야 함
      }),
    }),
    UsersModule,
    UtilModule,
    RedisModule,
    ProducerModule,
    AuthTokenModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    AppService,
  ],
})
export class AppModule {}
