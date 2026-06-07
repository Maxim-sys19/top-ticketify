export const BOOKING_BOOKED_QUEUE = 'booking.booked.queue';
export const ROUTING_KEY = 'booking.booked';
export const EXCHANGE = 'booking.events.exchange';
export const BookingBookedConsumerConfigs = {
  queue: BOOKING_BOOKED_QUEUE,
  routingKey: ROUTING_KEY,
  exchangeName: EXCHANGE,
  prefetch: 10,
};
