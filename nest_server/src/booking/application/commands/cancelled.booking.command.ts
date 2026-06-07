import { Command } from '@nestjs/cqrs';

export class CancelledBookingCommand extends Command<any> {
  constructor(public readonly bookingId: string) {
    super();
  }
}
