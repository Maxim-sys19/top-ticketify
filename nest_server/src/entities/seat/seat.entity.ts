import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntityWithID } from 'src/entities/base.entity';

@Entity('seats')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Seat extends BaseEntityWithID {
  @Column({ type: 'varchar', length: 100 })
  title: string;
  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;
  @Column({ type: 'datetime', nullable: true })
  locked_until: Date | string;
  @Column({ type: 'varchar', length: 36, nullable: true })
  looked_by_booking: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
