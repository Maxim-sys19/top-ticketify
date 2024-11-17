import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyUser } from '../user/company.user';

@Entity('company')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Company {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
  @OneToMany(() => CompanyUser, (user) => user.company, { cascade: true })
  users: CompanyUser[];
}
