import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity('routes')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Route {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start: string;
  @Column()
  end: string;
  @Column({ type: 'varchar', length: 100 })
  routeCode: string;
  @Column({ type: 'varchar', length: 100 })
  origin: string;
  @Column({ type: 'varchar', length: 100 })
  destination: string;
  @Column({ type: 'timestamp' })
  departureTime: Date;
  @Column({ type: 'timestamp' })
  arrivalTime: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
