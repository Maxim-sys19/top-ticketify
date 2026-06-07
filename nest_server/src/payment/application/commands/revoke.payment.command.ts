import { Command } from '@nestjs/cqrs';

type RevokePaymentReturnType = any;
export class RevokePaymentCommand extends Command<RevokePaymentReturnType> {
  constructor(
    // public readonly bookingId: string,
    public readonly paymentIntentId: string,
  ) {
    super();
  }
}
