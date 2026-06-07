import { BookingBookedEvent } from 'src/booking/domain/events/booking.booked.event';
import {
  BookingBookedForPaymentPayloadV1,
  BookingBookedForPaymentV1,
} from 'src/contracts/booking-booked-for-payment';
import { OutboxEvent } from 'src/outbox/domain/outbox-event';

export class BookingEventMapper {
  static toPaymentEvent(
    event: BookingBookedEvent,
    payload?: Partial<BookingBookedForPaymentPayloadV1>,
  ): OutboxEvent<BookingBookedForPaymentPayloadV1> {
    return {
      eventType: BookingBookedForPaymentV1.name,
      aggregateId: event.bookingId,
      exchange: BookingBookedForPaymentV1.exchange,
      aggregateType: BookingBookedForPaymentV1.aggregateType,
      routingKey: BookingBookedForPaymentV1.routingKey,
      processed: BookingBookedForPaymentV1.processed,
      payload: {
        bookingId: event.bookingId,
        userId: event.userId,
        ...payload,
      },
    };
  }
}
