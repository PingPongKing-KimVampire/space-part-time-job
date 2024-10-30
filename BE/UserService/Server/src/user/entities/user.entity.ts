import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('user')
@Unique('UQ_USER_ID', ['userId'])
@Unique('UQ_NICKNAME', ['nickname'])
@Unique('UQ_PHONE_NUMBER', ['phoneNumber'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 20, nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 64, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  nickname: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 11,
    nullable: false,
  })
  phoneNumber: string;

  static of({
    userId,
    password,
    nickname,
    phoneNumber,
  }: {
    userId: string;
    password: string;
    nickname: string;
    phoneNumber: string;
  }): User {
    const user = new User();
    user.userId = userId;
    user.password = password;
    user.nickname = nickname;
    user.phoneNumber = phoneNumber;
    return user;
  }
}
