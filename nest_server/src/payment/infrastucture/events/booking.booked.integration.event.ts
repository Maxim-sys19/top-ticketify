import { BookingBookedForPaymentPayloadV1 } from 'src/contracts/booking-booked-for-payment';

export class BookingBookedIntegrationEvent {
  public readonly data: {
    payload: BookingBookedForPaymentPayloadV1;
  };
}
