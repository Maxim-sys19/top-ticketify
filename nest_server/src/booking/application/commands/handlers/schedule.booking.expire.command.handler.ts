import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ScheduleBookingExpirationCommand } from 'src/booking/application/commands/schedule.booking.expiration.command';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@CommandHandler(ScheduleBookingExpirationCommand)
export class ScheduleBookingExpireCommandHandler
  implements ICommandHandler<ScheduleBookingExpirationCommand>
{
  constructor(
    @Inject('BOOKING_EXPIRE_CLIENT')
    private readonly bookingExpireClient: ClientProxy,
  ) {}

  async execute(command: ScheduleBookingExpirationCommand): Promise<any> {
    console.log('ScheduleBookingExpireCommandHandler executed :', command);
    try {
      await firstValueFrom(
        this.bookingExpireClient.emit('booking.delay', {
          bookingId: command.bookingId,
          expiresAt: command.expiresAt,
          userId: command.userId,
          seatIds: command.seatIds,
        }),
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
