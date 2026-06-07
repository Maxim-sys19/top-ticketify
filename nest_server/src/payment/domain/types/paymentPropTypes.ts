import { PaymentProviderEnums } from 'src/enums/payment.enums';

export interface PaymentPropTypes {
  bookingId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
  provider: PaymentProviderEnums;
  providerPaymentId: string;
  createdAt: Date;
}
