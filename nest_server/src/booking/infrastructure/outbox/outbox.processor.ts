import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { OutboxRepository } from 'src/outbox/infrastructure/repository/outbox.repository';

@Injectable()
export class OutboxProcessor {
  constructor(
    @Inject('BOOKING_BOOKED_CLIENT') private readonly clientProxy: ClientProxy,
    private readonly outboxRepositoty: OutboxRepository,
  ) {}
  @Cron('*/5 * * * * *')
  async process() {
    console.log('boking outbox processor execute by');
    const outboxEvents = await this.outboxRepositoty.findWithConditions({
      where: { processed: false },
      take: 50,
    });
    console.log(0, outboxEvents);
    if (!outboxEvents.length) {
      console.log('RETURN');
      return;
    }
    console.log(1, outboxEvents);
    for (const event of outboxEvents) {
      const integrationEvent = {
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        payload: event.payload,
        occuredAt: event.createdAt,
      };
      await this.clientProxy.emit(event.routingKey, integrationEvent);
    }
    await this.outboxRepositoty.markManyProcessed(
      outboxEvents.map((e) => e.id),
    );
  }
}
