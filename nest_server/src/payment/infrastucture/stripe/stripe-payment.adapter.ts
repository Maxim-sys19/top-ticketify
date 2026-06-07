import { PaymentServicePort } from 'src/payment/application/ports/outbound/payment-service.port';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Injectable, Logger } from '@nestjs/common';
import { Payment } from 'src/payment/domain/payment';
import { PaymentProviderEnums } from 'src/enums/payment.enums';
import { PaymentPropTypes } from 'src/payment/domain/types/paymentPropTypes';

@Injectable()
export class StripePaymentAdapter implements PaymentServicePort {
  private readonly stripe: Stripe;
  private readonly logger: Logger = new Logger(StripePaymentAdapter.name);
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('test_stripe_secret_key'));
  }
  async openPaymentAccess(bookingId: string, userId: string): Promise<Payment> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 100,
        currency: 'usd',
        metadata: { bookingId, userId },
      });
      // console.log('paymentIntent :', paymentIntent);
      const paymentDto: PaymentPropTypes = {
        bookingId: bookingId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        provider: PaymentProviderEnums.STRIPE,
        providerPaymentId: paymentIntent.id,
        createdAt: new Date(paymentIntent.created),
      };
      return Payment.create(paymentDto);
    } catch (err) {
      console.log('Stripe openPaymentAccess error :', err);
      throw err;
    }
  }
  async revokePaymentAccess(paymentId: string) {
    try {
      const cancel = await this.stripe.paymentIntents.cancel(paymentId);
      console.log('cancel payment :', cancel);
    } catch (err) {
      console.log('revokePaymentErr :', err);
      if (
        err instanceof Stripe.errors.StripeInvalidRequestError &&
        err.code === 'resource_missing'
      ) {
        this.logger.warn(
          `PaymentIntent not found, treating as revoke ${paymentId}`,
        );
        return;
      }
      throw err;
    }
  }
}
