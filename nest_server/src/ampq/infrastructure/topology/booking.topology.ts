export const BookingTopology = {
  exchanges: [
    {
      name: 'booking.delay.exchange',
      type: 'direct',
      options: { durable: true },
    },
    {
      name: 'booking.expire.exchange',
      type: 'direct',
      options: { durable: true },
    },
    {
      name: 'booking.events.exchange',
      type: 'topic',
      options: { durable: true },
    },
  ],
  queues: [
    {
      name: 'booking.delay.15m',
      options: {
        durable: true,
        arguments: {
          'x-message-ttl': 15000,
          'x-dead-letter-exchange': 'booking.expire.exchange',
          'x-dead-letter-routing-key': 'booking.expire',
        },
      },
      bindings: [
        { exchange: 'booking.delay.exchange', routingKey: 'booking.delay' },
      ],
    },
    {
      name: 'booking.expire.queue',
      options: { durable: true },
      bindings: [
        { exchange: 'booking.expire.exchange', routingKey: 'booking.expire' },
      ],
    },
    {
      name: 'booking.booked.queue',
      options: { durable: true },
      bindings: [
        {
          exchange: 'booking.events.exchange',
          routingKey: 'booking.booked',
        },
      ],
    },
    {
      name: 'booking.cancel.queue',
      options: { durable: true },
      bindings: [
        {
          exchange: 'booking.events.exchange',
          routingKey: 'booking.booked',
        },
      ],
    },
  ],
};
