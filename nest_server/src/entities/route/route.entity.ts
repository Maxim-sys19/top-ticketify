import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, Index,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import {v4 as uuidv4} from 'uuid';

@Entity('routes')
@TableInheritance({column: {type: 'varchar', name: 'type'}})
export class Route {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  routeName: string;
  @Column({type: 'json'})
  start: { lat: number; lng: number };
  @Column({type: 'json'})
  end: { lat: number; lng: number };
  @Column()
  start_address: string
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(`start`, '$.lat'))",
  })
  @Index()
  start_lat: number
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(`start`, '$.lng'))",
  })
  @Index()
  start_lng: number
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(`end`, '$.lat'))",
  })
  @Index()
  end_lat: number
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(`end`, '$.lng'))",
  })
  @Index()
  end_lng: number
  @Column()
  end_address: string
  @Column({type: 'json'})
  distance_meters: { text: string, value: number }
  @Column({type: 'json'})
  duration_seconds: { text: string, value: number }
  @Column({unique: true, type: 'varchar', length: 100, nullable: true})
  routeCode?: string;
  @Column({unique: true})
  uid: string;
  @Column({type: 'timestamp'})
  departureTime: Date;
  @Column({type: 'timestamp'})
  arrivalTime: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @Column({
    type: 'int',
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(distance_meters, '$.value'))",
  })
  @Index()
  distance_val: number;
  @Column({
    type: 'int',
    generatedType: 'STORED',
    asExpression: "JSON_UNQUOTE(JSON_EXTRACT(duration_seconds, '$.value'))",
  })
  @Index()
  duration_val: number;

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
