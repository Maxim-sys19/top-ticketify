import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CancelledBookingCommand } from 'src/booking/application/commands/cancelled.booking.command';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';

@CommandHandler(CancelledBookingCommand)
export class CancelledBookingCommandHandler
  implements ICommandHandler<CancelledBookingCommand>
{
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CancelledBookingCommand): Promise<any> {
    console.log('CancelledBookingCommandHandler executed :', command);
    const booking = await this.bookingRepository.findById(command.bookingId);
    const bookingCtx = this.eventPublisher.mergeObjectContext(booking);
    bookingCtx.cancel();
    bookingCtx.commit();
    return this.bookingRepository.save(booking);
  }
}
