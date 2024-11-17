import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('ticket')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 50 })
  passenger_name: string;
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  @Column('timestamp')
  journey_day: Date;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor() {
    this.id = uuidv4();
  }
}
