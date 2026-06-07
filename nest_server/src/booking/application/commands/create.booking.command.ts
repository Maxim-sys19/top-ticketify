import { Command } from '@nestjs/cqrs';
export type CreateBookingCommandReturnType = {
  success: boolean;
  message: string;
};
export class CreateBookingCommand extends Command<CreateBookingCommandReturnType> {
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
