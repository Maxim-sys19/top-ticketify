export enum PaymentStatusEnum {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Refunded = 'REFUNDED',
}
export class PaymentStatus {
  private readonly status: PaymentStatusEnum;
  constructor(status: PaymentStatusEnum) {
    this.status = status;
  }
  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.Pending);
  }
  static completed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.Completed);
  }
  static failed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.Failed);
  }
  static refunded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.Refunded);
  }
  static fromString(stringStatus: string): PaymentStatus {
    const normalize = stringStatus.trim().toUpperCase();
    const status = Object.values(PaymentStatusEnum).find(
      (s) => s === normalize,
    );
    if (!status) {
      throw new Error(`Invalid PaymentStatus: ${stringStatus}`);
    }
    return new PaymentStatus(status as PaymentStatusEnum);
  }
  getStatus(): PaymentStatusEnum {
    return this.status;
  }
  toString(): string {
    return this.status;
  }
  equals(other: PaymentStatus): boolean {
    if (!other) return false;
    return this.status === other.status;
  }
  isPending(): boolean {
    return this.status === PaymentStatusEnum.Pending;
  }
  isCompleted(): boolean {
    return this.status === PaymentStatusEnum.Completed;
  }
  isFailed(): boolean {
    return this.status === PaymentStatusEnum.Failed;
  }
  isRefunded(): boolean {
    return this.status === PaymentStatusEnum.Refunded;
  }
}
