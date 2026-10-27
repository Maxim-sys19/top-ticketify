import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';
import { BookingBookedConsumerConfigs } from '../configs/booking-booked.consumers.config';
import { OutboxRepository } from 'src/outbox/infrastructure/repository/outbox.repository';
import { EventBus } from '@nestjs/cqrs';
import { BookingBookedApplicationEvent } from 'src/payment/domain/events/booking.booked.application.event';
import { BookingBookedIntegrationEvent } from '../../events/booking.booked.integration.event';

@Injectable()
export class BookingBookedConsumer implements OnModuleInit {
  constructor(
    private readonly rmqpService: RabbitmqService,
    private readonly outboxRepository: OutboxRepository,
    private readonly eventBus: EventBus,
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
        async (msg) => {
          try {
            const integrationEvent: BookingBookedIntegrationEvent = JSON.parse(
              msg.content.toString(),
            );
            const appEvent = new BookingBookedApplicationEvent(
              integrationEvent.data.payload.bookingId,
              integrationEvent.data.payload.userId,
            );
            await this.eventBus.publish(appEvent);
            await this.rmqpService.ack(ch, msg);
          } catch (err) {
            console.log(
              `Error to consume MSG from ${BookingBookedConsumerConfigs.queue}: `,
              err,
            );
            ch.nack(msg, false, false);
          }
        },
      );
    } catch (e) {
      console.log('BookingBookedConsumer err :', e);
    }
  }
}
