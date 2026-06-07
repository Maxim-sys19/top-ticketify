import { Injectable, Logger } from '@nestjs/common';
import { LessThan } from 'typeorm';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';
import { CommandBus } from '@nestjs/cqrs';
import { BookingStatusEnum } from 'src/enums/booking.enums';
import { ExpiredBookingCommand } from 'src/booking/application/commands/expired.booking.command';

@Injectable()
export class BookingExpirationWorker {
  private readonly logger = new Logger(BookingExpirationWorker.name);
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly commandBus: CommandBus,
  ) {}
  async checkExpireBooking() {
    const now = new Date();
    console.log('checkExpireBooking cron job execute every 30 sec');
    const bookings = await this.bookingRepository.findWithConditions({
      where: {
        status: BookingStatusEnum.BOOKED,
        expirationTime: LessThan(now),
      },
    });
    if (bookings.length === 0) {
      return;
    }
    this.logger.log(`Found ${bookings.length} expired bookings`);
    for (const booking of bookings) {
      try {
        await this.commandBus.execute(
          new ExpiredBookingCommand(
            booking.id,
            booking.userId,
            booking.seatIds,
            'cron',
          ),
        );
      } catch (err) {
        this.logger.error(
          `Failed to process booking ${booking.id}: ${err.message}`,
        );
      }
    }
    this.logger.log(
      `Processed ${bookings.length} expired bookings successfully`,
    );
  }
}
