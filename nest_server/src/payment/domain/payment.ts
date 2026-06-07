import { AggregateRoot } from '@nestjs/cqrs';
import { Money } from 'src/payment/domain/value-objects/Money';
import { PaymentStatus } from 'src/payment/domain/value-objects/PaymentStatus';
import { PaymentProviderEnums } from 'src/enums/payment.enums';
import { PaymentPropTypes } from 'src/payment/domain/types/paymentPropTypes';
import { Amount } from 'src/payment/domain/value-objects/Amount';
import { PaymentCurrency } from 'src/payment/domain/value-objects/PaymentCurrency';
import { StripePaymentStatusMapper } from 'src/payment/infrastucture/stripe/stripe-payment-status.mapper';
import { PaymentCreatedEvent } from 'src/payment/domain/events/payment.created.event';

export class Payment extends AggregateRoot {
  constructor(
    public paymentId: string,
    public money: Money,
    public status: PaymentStatus,
    public provider: PaymentProviderEnums,
    public providerPaymentId: string,
    public createdAt: Date,
  ) {
    super();
  }
  static create(props: PaymentPropTypes) {
    const money = Money.create(
      Amount.create(props.amount),
      PaymentCurrency.fromString(props.currency),
    );
    const status = StripePaymentStatusMapper.toDomainStatus(props.status);
    const payment = new Payment(
      props.paymentId,
      money,
      status,
      props.provider,
      props.providerPaymentId,
      props.createdAt,
    );
    payment.apply(new PaymentCreatedEvent(payment.paymentId, props.bookingId));
    return payment;
  }
  complete() {
    if (this.status.isCompleted()) return;
    if (!this.status.isPending()) {
      throw new Error(
        `Cannot complete payment from status: ${this.status.toString()}`,
      );
    }
    this.status = PaymentStatus.completed();
  }
  fail() {
    if (this.status.isFailed()) return;
    if (!this.status.isPending()) {
      throw new Error(
        `Cannot fail payment from status: ${this.status.toString()}`,
      );
    }
    this.status = PaymentStatus.failed();
  }
  refund() {
    if (this.status.isRefunded()) return;
    if (!this.status.isCompleted()) {
      throw new Error(
        `Cannot refund payment from status: ${this.status.toString()}`,
      );
    }
    this.status = PaymentStatus.refunded();
  }
}
