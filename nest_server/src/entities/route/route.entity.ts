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

@Entity('routes')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Route {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  start: string;
  @Column()
  end: string;
  @Column({unique: true, type: 'varchar', length: 100 })
  routeCode: string;
  @Column({type: 'timestamp'})
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
  @BeforeUpdate()
  generateRouteCode() {
    if(this.start && this.end) {
      this.routeCode = `${this.start}-${this.end}-${this.id}`.toUpperCase().replace(/\s+/g, '').slice(0, 100);
    }
  }
}
