import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingCreatedEvent } from 'src/booking/domain/events/booking.created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BookingCreatedEvent)
export class BookingCreatedEventHandler
  implements IEventHandler<BookingCreatedEvent>
{
  private readonly logger = new Logger(BookingCreatedEventHandler.name);
  handle(event: BookingCreatedEvent) {
    console.log('BookingBookedEvent event handler :', event);
    // throw new Error("Method not implemented.");
  }
}
