import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatusEnum } from '../../enums/booking.enums';
import { BaseEntityWithID } from '../base.entity';
import { customAlphabet } from 'nanoid';

const generateBookingCode = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);
@Index(['userId', 'routeId'])
@Entity('bookings')
export class Booking extends BaseEntityWithID {
  @Column()
  userId: string;
  @Column()
  routeId: string;
  @Column()
  transportId: string;
  @Column()
  seatId: string;
  @Column({
    type: 'enum',
    enum: BookingStatusEnum,
    default: BookingStatusEnum.PENDING,
  })
  status: BookingStatusEnum;
  @Column({ unique: true })
  uniqueId: string;
  @Column()
  companyId: string;
  @Column()
  bookingTime: Date;
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
