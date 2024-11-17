import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transport')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Transport {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column({ length: 255 })
  description: string;
  @Column()
  capacity: number;
  @Column({ type: 'date', nullable: true })
  maintenanceDate: Date;
  @Column({ default: true })
  isActive: boolean;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
