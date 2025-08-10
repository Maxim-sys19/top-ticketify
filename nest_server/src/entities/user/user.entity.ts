import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../../enums/user.enums';
import { Exclude } from 'class-transformer';
import {
  AuthProviderEnums,
  AuthProviderType,
} from '../../enums/auth.provider.enums';
import { BaseEntityWithID } from '../base.entity';

@Entity({
  name: 'users',
})
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User extends BaseEntityWithID {
  @Column({
    type: 'varchar',
  })
  name: string;
  @Column({
    type: 'varchar',
  })
  email: string;
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Exclude()
  password: string;
  @Column({
    type: 'enum',
    enum: AuthProviderEnums,
    default: AuthProviderEnums.LOCAL,
  })
  authProvider: AuthProviderType;
  @Column({
    type: 'enum',
    enum: UserStatus,
    nullable: true,
    default: UserStatus.Pending,
  })
  status: string;
  @Column({
    type: 'longblob',
    nullable: true,
  })
  avatar: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
