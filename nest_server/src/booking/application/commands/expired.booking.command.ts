import { Command } from '@nestjs/cqrs';

export class ExpiredBookingCommand extends Command<any> {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string,
    public readonly seatIds: string[],
  ) {
    super();
  }
}
