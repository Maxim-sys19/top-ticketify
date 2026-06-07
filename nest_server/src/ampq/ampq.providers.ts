import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ClientsProviderAsyncOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { resolverRmqOptionsByQueue } from './infrastructure/topology/topologyResolver';
import { BOOKING_BOOKED_QUEUE } from 'src/payment/infrastucture/messaging/configs/booking-booked.consumers.config';

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
    useFactory: (configService: ConfigService): CustomRmqOptions => {
      const rmqConfig = resolverRmqOptionsByQueue('user_queue');
      return {
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('amq_connection')],
          ...rmqConfig,
        },
      };
    },
  },
  {
    name: 'EMAIL_QUEUE_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): CustomRmqOptions => {
      const rmqConfig = resolverRmqOptionsByQueue('email_queue');
      return {
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('amq_connection')],
          ...rmqConfig,
        },
      };
    },
  },
  {
    name: 'BOOKING_EXPIRE_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): CustomRmqOptions => {
      const rmqConfig = resolverRmqOptionsByQueue('booking.delay.15m');
      return {
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('amq_connection')],
          ...rmqConfig,
        },
      };
    },
  },
  {
    name: 'BOOKING_BOOKED_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService): CustomRmqOptions => {
      const rmqConfig = resolverRmqOptionsByQueue(BOOKING_BOOKED_QUEUE);
      return {
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('amq_connection')],
          ...rmqConfig,
        },
      };
    },
  },
];
