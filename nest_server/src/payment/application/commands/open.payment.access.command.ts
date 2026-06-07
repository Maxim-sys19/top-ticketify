import { Command } from '@nestjs/cqrs';
export type OpenPaymentAccessCommandReturnType = { client_secret: string };
export class OpenPaymentAccessCommand extends Command<any> {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
