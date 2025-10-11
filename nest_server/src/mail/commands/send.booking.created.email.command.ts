import { Command } from '@nestjs/cqrs';

export class SendBookingCreatedEmailCommand extends Command<any> {
  constructor(
    public readonly bookingId: string,
    private readonly userName: string,
  ) {
    super();
  }
}
