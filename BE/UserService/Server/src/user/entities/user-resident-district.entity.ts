import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_resident_district')
export class UserResidentDistrict {
  @Column({ primary: true, name: 'user_id', type: 'varchar', length: 40 })
  userId: string;

  @Column({ primary: true, name: 'district_id', type: 'varchar', length: 20 })
  districtId: string;

  @ManyToOne(() => User, (user) => user.residentDistricts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  static of(userId: string, districtId: string): UserResidentDistrict {
    const instance = new UserResidentDistrict();
    instance.userId = userId;
    instance.districtId = districtId;
    return instance;
  }
}
