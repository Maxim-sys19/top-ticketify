import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingBookedEvent } from '../../domain/events/booking.booked.event';
import { OutboxRepository } from 'src/outbox/infrastructure/repository/outbox.repository';
import { BookingEventMapper } from '../mappers/booking.event.mapper';
import { OutboxMapper } from 'src/entities/outbox/infrastructure/mappers/outbox.mapper';

@EventsHandler(BookingBookedEvent)
export class BookingBookedEventHandler
  implements IEventHandler<BookingBookedEvent>
{
  constructor(private readonly outboxRepository: OutboxRepository) {}
  async handle(event: BookingBookedEvent) {
    console.log('BookingBookedEventHandler executed :', event);
    const domainEvent = BookingEventMapper.toPaymentEvent(event);
    const entity = OutboxMapper.toEntity(domainEvent);
    await this.outboxRepository.save(entity);
  }
}
