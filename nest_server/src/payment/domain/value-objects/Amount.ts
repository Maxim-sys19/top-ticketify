export class Amount {
  private readonly amount: number;
  constructor(amount: number) {
    this.amount = amount;
    this.validate();
  }
  static create(value: number) {
    return new Amount(value);
  }
  equals(other: Amount): boolean {
    return other && this.amount === other.amount;
  }
  add(other: Amount): Amount {
    return Amount.create(this.amount + other.amount);
  }
  subtract(other: Amount): Amount {
    const result = this.amount - other.amount;
    if (result < 0) throw new Error('Result can not be negative');
    return Amount.create(result);
  }
  multiply(coefficient: number) {
    return Amount.create(this.amount * coefficient);
  }
  private validate() {
    if (typeof this.amount !== 'number' || isNaN(this.amount)) {
      throw new Error('Amount must be valid number');
    }
    if (this.amount < 0) {
      throw new Error('Amount can not be negative');
    }
  }
  getAmount(): number {
    return this.amount;
  }
}
