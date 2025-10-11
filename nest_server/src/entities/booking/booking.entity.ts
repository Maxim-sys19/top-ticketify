import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatusEnum } from 'src/enums/booking.enums';
import { BaseEntityWithID } from '../base.entity';
import { customAlphabet } from 'nanoid';

const generateBookingCode = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);
@Index(['userId', 'routeId'])
@Entity('bookings')
export class Booking extends BaseEntityWithID {
  @Column({ type: 'varchar', length: 36 })
  userId: string;
  @Column({ type: 'varchar', length: 36 })
  routeId: string;
  @Column({ type: 'varchar', length: 36 })
  transportId: string;
  @Column({ type: 'varchar', length: 36 })
  seatIds: string[];
  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.PENDING,
  })
  status: BookingStatusEnum;
  @Column({ unique: true })
  uniqueId: string;
  @Column({ type: 'varchar', length: 36 })
  companyId: string;
  @Column({ type: 'datetime' })
  bookingTime: Date | string;
  @Column()
  expirationTime: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @BeforeInsert()
  async generateUniqueID() {
    if (!this.uniqueId) {
      this.uniqueId = `BOOK-${generateBookingCode()}`;
    }
  }
}
