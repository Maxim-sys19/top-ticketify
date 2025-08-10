import { BookingStatusEnum } from '../../enums/booking.enums';
import { BookingPropTypes } from './types/booking.prop.types';
import { v4 as uuidv4 } from 'uuid';

export class Booking {
  constructor(
    public id: string,
    public userId: string,
    public routeId: string,
    public companyId: string,
    public transportId: string,
    public seatId: string,
    public bookingTime: Date,
    public expirationTime: Date,
    public status: BookingStatusEnum,
  ) {}
  static create(props: BookingPropTypes) {
    console.log('Booking.create() scope:');
    const id = uuidv4();
    const status = BookingStatusEnum.PENDING;
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);
    return new Booking(
      id,
      props.userId,
      props.routeId,
      props.companyId,
      props.transportId,
      props.seatId,
      props.bookingTime,
      expirationTime,
      status,
    );
  }
  confirm() {
    if (this.status === BookingStatusEnum.PENDING) {
      console.log('Booking.confirm() scope:');
      this.status = BookingStatusEnum.CONFIRMED;
    }
  }
  cancel() {
    if (this.status === BookingStatusEnum.PENDING) {
      this.status = BookingStatusEnum.CANCELLED;
    }
  }
}
