import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('routes')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Route {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  routeName: string;
  @Column({ type: 'json' })
  start: { lat: number; lng: number };
  @Column({ type: 'json' })
  end: { lat: number; lng: number };
  @Column({ type: 'json' })
  path: { lat: number; lng: number }[];
  @Column({ unique: true, type: 'varchar', length: 100, nullable: true })
  routeCode?: string;
  @Column({ unique: true })
  uid: string;
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

  @BeforeInsert()
  async generateUID() {
    this.uid = this.uid ?? uuidv4();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async generateRouteCode() {
    if (this.start && this.end) {
      this.routeCode = `${this.routeName}-${JSON.stringify(this.uid)}`
        .toUpperCase()
        .replace(/"/g, '')
        .slice(0, 100);
    }
  }
}
