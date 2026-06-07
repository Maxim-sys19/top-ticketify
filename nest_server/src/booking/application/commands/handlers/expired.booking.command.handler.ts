import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ExpiredBookingCommand } from 'src/booking/application/commands/expired.booking.command';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(ExpiredBookingCommand)
export class ExpiredBookingCommandHandler
  implements ICommandHandler<ExpiredBookingCommand>
{
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute({
    bookingId,
    triggeredBy,
  }: ExpiredBookingCommand): Promise<any> {
    console.log(
      `ExpiredBookingCommandHandler triggered by - ${triggeredBy}  : ${bookingId}`,
    );
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      if (!booking)
        throw new NotFoundException(
          `Booking with ID - ${booking.id} not found`,
        );
      const bockingMergeCtx = this.eventPublisher.mergeObjectContext(booking);
      bockingMergeCtx.expired();
      bockingMergeCtx.commit();
      await this.bookingRepository.save(bockingMergeCtx);
    } catch (err) {
      console.log('ExpiredBookingCommandHandler Err :', err);
      throw err;
    }
  }
}
