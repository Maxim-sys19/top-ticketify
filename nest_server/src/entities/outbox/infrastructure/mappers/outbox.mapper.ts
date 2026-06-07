import { OutboxEvent } from 'src/outbox/domain/outbox-event';
import { OutboxEntity } from '../outbox.entity';

export class OutboxMapper {
  static toEntity(event: OutboxEvent<any>): OutboxEntity {
    return {
      id: undefined,
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      exchange: event.exchange,
      routingKey: event.routingKey,
      processed: event.processed,
      createdAt: event.createdAt,
      payload: JSON.stringify(event.payload),
    };
  }
}
