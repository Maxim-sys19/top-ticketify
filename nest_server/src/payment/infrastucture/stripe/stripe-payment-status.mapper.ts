import { PaymentStatus } from 'src/payment/domain/value-objects/PaymentStatus';

export class StripePaymentStatusMapper {
  static toDomainStatus(stripeStatus: string): PaymentStatus {
    switch (stripeStatus) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
      case 'processing':
      case 'requires_capture':
        return PaymentStatus.pending();

      case 'succeeded':
        return PaymentStatus.completed();

      case 'canceled':
        return PaymentStatus.failed();

      default:
        throw new Error(`Unknown Stripe status: ${stripeStatus}`);
    }
  }
}
