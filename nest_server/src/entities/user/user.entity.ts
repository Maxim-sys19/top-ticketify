import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../../enums/user.enums';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'users',
})
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
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
  })
  @Exclude()
  password: string;
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
