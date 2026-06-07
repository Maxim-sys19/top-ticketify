import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

export const rabbitMicroservices = async (
  config: ConfigService,
): Promise<RmqOptions[]> => {
  return [
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>('amq_connection')],
        queue: 'user_queue',
        queueOptions: { durable: false },
      },
    },
    {
      transport: Transport.RMQ,
      options: {
        urls: [config.get<string>('amq_connection')],
        queue: 'email_queue',
        queueOptions: { durable: false },
        prefetchCount: 100,
        noAck: false,
      },
    },
  ];
};
