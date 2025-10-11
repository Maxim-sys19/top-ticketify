import { ConfigService } from '@nestjs/config';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { ClientsProviderAsyncOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';

interface CustomRmqOptions extends Omit<RmqOptions, 'options'> {
  options: RmqOptions['options'] & {
    exchange: string;
    exchangeType: string;
    routingKeys: string[];
  };
}

export const AmpqProviders: ClientsProviderAsyncOptions[] = [
  {
    name: 'USER_QUEUE_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): CustomRmqOptions => ({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('amq_connection')],
        queue: 'user_queue',
        exchange: 'user_exchange',
        exchangeType: 'topic',
        routingKeys: ['user.created', 'user.updated', 'user.deleted'],
        queueOptions: { durable: false },
      },
    }),
  },
  {
    name: 'EMAIL_QUEUE_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): CustomRmqOptions => ({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('amq_connection')],
        queue: 'email_queue',
        exchange: 'email_exchange',
        exchangeType: 'topic',
        routingKeys: ['email.verification', 'email.resetPwd'],
        queueOptions: { durable: false },
      },
    }),
  },
  {
    name: 'BOOKING_EXPIRE_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): CustomRmqOptions => ({
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('amq_connection')],
        queue: 'booking.delay.15m',
        exchange: 'booking.delay.exchange',
        exchangeType: 'direct',
        routingKeys: ['booking.delay'],
        queueOptions: {
          durable: true,
          arguments: {
            'x-message-ttl': 15 * 60 * 1000,
            'x-dead-letter-exchange': 'booking.expire.exchange',
            'x-dead-letter-routing-key': 'booking.expire',
          },
        },
      },
    }),
  },
];
