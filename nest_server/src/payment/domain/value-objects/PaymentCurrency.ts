import { PaymentCurrencyEnums } from 'src/enums/payment.enums';

export class PaymentCurrency {
  private readonly value: PaymentCurrencyEnums;
  private static readonly allowedCurrencies = new Set([
    PaymentCurrencyEnums.EUR,
    PaymentCurrencyEnums.USD,
  ]);
  private static readonly decimalsMap: Record<PaymentCurrencyEnums, number> = {
    [PaymentCurrencyEnums.USD]: 2,
    [PaymentCurrencyEnums.EUR]: 2,
  };
  constructor(value: PaymentCurrencyEnums) {
    this.value = value;
    this.validate();
  }
  static create(value: PaymentCurrencyEnums): PaymentCurrency {
    return new PaymentCurrency(value);
  }
  static fromString(currency: string): PaymentCurrency {
    if(!currency) throw new Error('Currency is missing');
    const upper = currency.toUpperCase();
    const isValidPaymentCurrency = Object.values(PaymentCurrencyEnums).includes(upper as PaymentCurrencyEnums);
    if(!isValidPaymentCurrency) {
      throw new Error(`Currency ${currency} is not supported`);
    }
    return new PaymentCurrency(upper as PaymentCurrencyEnums);
  }
  equals(other: PaymentCurrency): boolean {
    return !!other && this.value === other.value;
  }
  getDecimals(): number {
    return PaymentCurrency.decimalsMap[this.value];
  }
  getValue(): PaymentCurrencyEnums {
    return this.value;
  }
  private isSupported(): boolean {
    return PaymentCurrency.allowedCurrencies.has(this.value);
  }
  private validate() {
    if (!this.isSupported()) {
      throw new Error(`Currency ${this.value} is not supported`);
    }
  }
}
