import { Command } from '@nestjs/cqrs';


export class LockSeatCommand extends Command<any> {
  constructor(
    public readonly seatIds: string[],
    public readonly bookingId: string,
    public readonly expiresAt: Date,
  ) {
    super();
  }
}
