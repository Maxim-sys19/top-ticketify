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
  async execute({ bookingId }: ExpiredBookingCommand): Promise<any> {
    console.log('ExpiredBookingCommandHandler : ', bookingId);
    try {
      const booking = await this.bookingRepository.findById(bookingId);
      // console.log('foundBooking by id :', booking.id);
      if (!booking)
        throw new NotFoundException(
          `Booking with ID - ${booking.id} not found`,
        );
      const bockingMergeCtx = this.eventPublisher.mergeObjectContext(booking);
      bockingMergeCtx.expired();
      await this.bookingRepository.save(bockingMergeCtx);
      bockingMergeCtx.commit();
    } catch (err) {
      console.log('ExpiredBookingCommandHandler Err :', err);
    }
  }
}
