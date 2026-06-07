export const UserTopology = {
  exchanges: [
    { name: 'email_exchange', type: 'topic', options: { durable: true } },
    { name: 'user_exchange', type: 'topic', options: { durable: true } },
  ],
  queues: [
    {
      name: 'email_queue',
      options: {
        durable: false,
        arguments: {},
      },
      bindings: [
        {
          exchange: 'email_exchange',
          routingKey: 'email.verification',
        },
        {
          exchange: 'email_exchange',
          routingKey: 'email.resetPwd',
        },
      ],
    },
    {
      name: 'user_queue',
      options: { durable: false },
      bindings: [
        { exchange: 'user_exchange', routingKey: 'user.created' },
        { exchange: 'user_exchange', routingKey: 'user.updated' },
        { exchange: 'user_exchange', routingKey: 'user.deleted' },
      ],
    },
  ],
};
