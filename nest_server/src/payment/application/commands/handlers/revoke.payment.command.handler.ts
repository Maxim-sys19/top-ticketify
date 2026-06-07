import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokePaymentCommand } from 'src/payment/application/commands/revoke.payment.command';
import { Inject } from '@nestjs/common';
import {
  PAYMENT_SERVICE,
  PaymentServicePort,
} from 'src/payment/application/ports/outbound/payment-service.port';

@CommandHandler(RevokePaymentCommand)
export class RevokePaymentCommandHandler
  implements ICommandHandler<RevokePaymentCommand>
{
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: PaymentServicePort,
  ) {}
  async execute(command: RevokePaymentCommand): Promise<any> {
    try {
      console.log('RevokePaymentCommandHandler executed: ', command);
      const result = await this.paymentService.revokePaymentAccess(
        command.paymentIntentId,
      );
      console.log('REsult : ', result);
    } catch (err) {
      throw err;
    }
  }
}
