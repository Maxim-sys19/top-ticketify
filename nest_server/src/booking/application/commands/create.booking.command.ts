import { Command } from '@nestjs/cqrs';

export class CreateBookingCommand extends Command<{
  success: boolean;
  message: string;
}> {
  constructor(
    public readonly userId: string,
    public readonly routeId: string,
    public readonly companyId: string,
    public readonly transportId: string,
    public readonly seatIds: string[],
    public readonly bookingTime: string | Date,
  ) {
    super();
  }
}
