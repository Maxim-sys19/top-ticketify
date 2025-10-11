import { Command } from '@nestjs/cqrs';

export class ScheduleBookingExpirationCommand extends Command<any> {
  constructor(
    public readonly bookingId: string,
    public readonly expiresAt: Date,
    public readonly userId: string,
    public readonly seatIds: string[],
  ) {
    super();
  }
}
