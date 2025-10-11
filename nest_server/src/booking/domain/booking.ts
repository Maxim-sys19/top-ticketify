import { BookingPropTypes } from './types/booking.prop.types';
import { v4 as uuidv4 } from 'uuid';
import { BookingStatus } from 'src/booking/domain/value-objects/BookingStatus';
import { AggregateRoot } from '@nestjs/cqrs';
import { BookingCreatedEvent } from 'src/booking/domain/events/booking.created.event';
import { BookingBookedEvent } from 'src/booking/domain/events/booking.booked.event';
import { BookingExpiredEvent } from 'src/booking/domain/events/booking.expired.event';
import { BookingConfirmEvent } from 'src/booking/domain/events/booking.confirm.event';
import { BookingCancelEvent } from 'src/booking/domain/events/booking.cancel.event';
import { BookingRejectEvent } from 'src/booking/domain/events/booking.reject.event';
import { BookingCompleteEvent } from 'src/booking/domain/events/booking.complete.event';
import { BookingFailedEvent } from 'src/booking/domain/events/booking.failed.event';

export class Booking extends AggregateRoot {
  constructor(
    public id: string,
    public userId: string,
    public routeId: string,
    public companyId: string,
    public transportId: string,
    public seatIds: string[],
    public bookingTime: Date | string,
    public expirationTime: Date,
    public status: BookingStatus,
  ) {
    super();
  }
  static create(props: BookingPropTypes): Booking {
    console.log('Booking.create() scope:');
    const id = uuidv4();
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000);
    const booking = new Booking(
      id,
      props.userId,
      props.routeId,
      props.companyId,
      props.transportId,
      props.seatIds,
      props.bookingTime,
      expirationTime,
      BookingStatus.Pending,
    );
    booking.apply(
      new BookingCreatedEvent(
        booking.id,
        booking.userId,
        booking.seatIds,
        booking.routeId,
        booking.expirationTime,
      ),
    );
    return booking;
  }
  booked(
    bookingId: string,
    bookingTime: string | Date,
    userId: string,
    seatId: string,
    transportId: string,
    routeId: string,
  ) {
    this.status = this.status.toBooked();
    this.apply(
      new BookingBookedEvent(
        userId,
        routeId,
        seatId,
        transportId,
        bookingId,
        bookingTime,
      ),
    );
  }
  confirm() {
    this.status = this.status.toConfirmed();
    this.apply(new BookingConfirmEvent(this.id));
  }
  cancel() {
    this.status = this.status.toCancelled();
    this.apply(new BookingCancelEvent(this.id, this.userId));
  }
  reject() {
    this.status = this.status.toRejected();
    this.apply(new BookingRejectEvent(this.id));
  }
  complete() {
    this.status = this.status.toCompleted();
    this.apply(new BookingCompleteEvent(this.id));
  }
  expired() {
    this.status = this.status.toExpired();
    this.apply(new BookingExpiredEvent(this.id, this.seatIds, this.userId));
  }
  failed() {
    this.status = this.status.toFailed();
    this.apply(new BookingFailedEvent(this.id));
  }
}
