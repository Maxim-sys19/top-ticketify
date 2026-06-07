import { Payment } from 'src/payment/domain/payment';

export interface PaymentServicePort {
  openPaymentAccess(bookingId: string, userId: string): Promise<Payment>;
  revokePaymentAccess(paymentIntentId: string): Promise<void>;
}
export const PAYMENT_SERVICE = Symbol('PAYMENT_SERVICE');
