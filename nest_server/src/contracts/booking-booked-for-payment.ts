export const BookingBookedForPaymentV1 = {
  name: 'booking.booked.v1',
  aggregateType: 'Booking',
  exchange: 'booking.events.exchange',
  routingKey: 'booking.booked',
  processed: false,
};
export interface BookingBookedForPaymentPayloadV1 {
  bookingId: string;
  userId: string;
  amount?: number | string;
}
