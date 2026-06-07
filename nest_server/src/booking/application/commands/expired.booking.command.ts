import { Command } from '@nestjs/cqrs';

export class ExpiredBookingCommand extends Command<any> {
  constructor(
    readonly bookingId: string,
    readonly userId: string,
    readonly seatIds: string[],
    readonly triggeredBy?: 'rabbitmq' | 'cron',
  ) {
    super();
  }
}
