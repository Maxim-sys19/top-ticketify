import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';
import { BookingBookedConsumerConfigs } from '../configs/booking-booked.consumers.config';
import { OutboxRepository } from 'src/outbox/infrastructure/repository/outbox.repository';

@Injectable()
export class BookingBookedConsumer implements OnModuleInit {
  constructor(
    private readonly rmqpService: RabbitmqService,
    private readonly outboxRepository: OutboxRepository,
  ) {}
  async onModuleInit() {
    console.log('BookingBookedConsumer executed');
    try {
      const conn = await this.rmqpService.getConnection();
      const ch = await conn.createChannel();
      await this.rmqpService.assertQueueWithChannel(
        ch,
        BookingBookedConsumerConfigs.queue,
      );
      await this.rmqpService.bindQueueWithChannel(
        ch,
        BookingBookedConsumerConfigs.queue,
        BookingBookedConsumerConfigs.exchangeName,
        BookingBookedConsumerConfigs.routingKey,
      );
      await ch.prefetch(BookingBookedConsumerConfigs.prefetch);
      await this.rmqpService.consume(
        ch,
        BookingBookedConsumerConfigs.queue,
        (msg) => {
          try {
            const data = JSON.parse(msg.content.toString());
            console.log('DATA! :', data);
          } catch (err) {
            console.log(
              `Error to consume MSG from ${BookingBookedConsumerConfigs.queue}: `,
              err,
            );
          }
        },
      );
    } catch (e) {
      console.log('BookingBookedConsumer err :', e);
    }
  }
}
