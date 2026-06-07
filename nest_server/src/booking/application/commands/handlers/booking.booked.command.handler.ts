import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { BookingBookedCommand } from 'src/booking/application/commands/booking.booked.command';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';

@CommandHandler(BookingBookedCommand)
export class BookingBookedCommandHandler
  implements ICommandHandler<BookingBookedCommand>
{
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(command: BookingBookedCommand): Promise<any> {
    console.log('BookingBookedCommandHandler executed :', command);
    const { bookingId, userId } = command;
    try {
      const booking = await this.bookingRepository.findById(command.bookingId);
      const bookingCtx = this.eventPublisher.mergeObjectContext(booking);
      bookingCtx.booked(bookingId, userId);
      bookingCtx.commit();

      await this.bookingRepository.save(bookingCtx);
    } catch (err) {
      console.log('BookingBookedCommandHandler Err :', err);
    }
  }
}
