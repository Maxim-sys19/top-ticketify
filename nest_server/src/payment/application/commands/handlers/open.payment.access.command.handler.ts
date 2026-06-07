import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { OpenPaymentAccessCommand } from 'src/payment/application/commands/open.payment.access.command';
import { Inject } from '@nestjs/common';
import {
  PAYMENT_SERVICE,
  PaymentServicePort,
} from 'src/payment/application/ports/outbound/payment-service.port';

@CommandHandler(OpenPaymentAccessCommand)
export class OpenPaymentAccessCommandHandler
  implements ICommandHandler<OpenPaymentAccessCommand>
{
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: PaymentServicePort,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(command: OpenPaymentAccessCommand) {
    const { bookingId, userId } = command;
    console.log('OpenPaymentAccessCommandHandler executed :', command);
    try {
      const payment = await this.paymentService.openPaymentAccess(
        bookingId,
        userId,
      );
      // console.log('PAYMENT created:', payment);
      const paymentCtx = this.eventPublisher.mergeObjectContext(payment);
      paymentCtx.commit();
    } catch (err) {
      console.log('OpenPaymentAccessCommandHandler err :', err);
      throw err;
    }
  }
}
