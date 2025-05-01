import {
  AfterInsert,
  AfterUpdate,
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
  start: string;
  @Column()
  end: string;
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
      this.routeCode = `${this.start}-${this.end}-${JSON.stringify(this.uid)}`
        .toUpperCase()
        .replace(/"/g, '')
        .slice(0, 100);
    }
  }
}
