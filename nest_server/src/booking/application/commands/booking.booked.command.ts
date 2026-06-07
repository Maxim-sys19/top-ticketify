import { Command } from '@nestjs/cqrs';

export class BookingBookedCommand extends Command<any> {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
