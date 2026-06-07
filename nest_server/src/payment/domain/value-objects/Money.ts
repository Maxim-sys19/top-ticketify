import { PaymentCurrency } from 'src/payment/domain/value-objects/PaymentCurrency';
import { Amount } from 'src/payment/domain/value-objects/Amount';

export class Money {
  private readonly amount: Amount;
  private readonly currency: PaymentCurrency;
  constructor(amount: Amount, currency: PaymentCurrency) {
    this.amount = amount;
    this.currency = currency;
    this.validate();
  }
  static create(amount: Amount, currency: PaymentCurrency): Money {
    return new Money(amount, currency);
  }
  getAmount(): Amount {
    return this.amount;
  }
  getCurrency(): PaymentCurrency {
    return this.currency;
  }
  equals(other: Money): boolean {
    return (
      !!other &&
      this.amount.equals(other.amount) === this.currency.equals(other.currency)
    );
  }
  add(other: Money): Money {
    this.assertSameCurrency(other);
    const newAmount = this.amount.add(other.amount);
    return Money.create(newAmount, this.currency);
  }
  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const newAmount: Amount = this.amount.subtract(other.amount);
    return Money.create(newAmount, this.currency);
  }
  multiply(coefficient: number): Money {
    const newAmount = this.amount.multiply(coefficient);
    return Money.create(newAmount, this.currency);
  }
  private assertSameCurrency(other: Money) {
    if (!this.currency.equals(other.currency)) {
      throw new Error(
        `Money operation failed : currencies dont match (${this.currency.getValue()} vs ${other.currency.getValue()})`,
      );
    }
  }
  private validate() {
    if (!(this.amount instanceof Amount)) {
      throw new Error('Money.amount must be an Amount VO');
    }
    if (!(this.currency instanceof PaymentCurrency)) {
      throw new Error('Money.currency must be PaymentCurrency VO');
    }
  }
}
