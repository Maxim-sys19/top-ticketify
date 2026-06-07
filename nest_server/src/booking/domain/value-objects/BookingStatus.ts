import { BookingStatusEnum } from 'src/enums/booking.enums';

export class BookingStatus {
  constructor(private readonly value: BookingStatusEnum) {}

  static Booked = new BookingStatus(BookingStatusEnum.BOOKED);
  static Confirmed = new BookingStatus(BookingStatusEnum.CONFIRMED);
  static Canceled = new BookingStatus(BookingStatusEnum.CANCELLED);
  static Rejected = new BookingStatus(BookingStatusEnum.REJECTED);
  static Completed = new BookingStatus(BookingStatusEnum.COMPLETED);
  static Expired = new BookingStatus(BookingStatusEnum.EXPIRED);
  static Pending = new BookingStatus(BookingStatusEnum.PENDING);
  static Failed = new BookingStatus(BookingStatusEnum.FAILED);

  static from(value: BookingStatusEnum) {
    switch (value) {
      case BookingStatusEnum.BOOKED:
        return BookingStatus.Booked;
      case BookingStatusEnum.CONFIRMED:
        return BookingStatus.Confirmed;
      case BookingStatusEnum.CANCELLED:
        return BookingStatus.Canceled;
      case BookingStatusEnum.REJECTED:
        return BookingStatus.Rejected;
      case BookingStatusEnum.COMPLETED:
        return BookingStatus.Completed;
      case BookingStatusEnum.EXPIRED:
        return BookingStatus.Expired;
      case BookingStatusEnum.PENDING:
        return BookingStatus.Pending;
      case BookingStatusEnum.FAILED:
        return BookingStatus.Failed;
      default:
        throw new Error(`Invalid BookingStatus : ${value}`);
    }
  }

  toEnum(): BookingStatusEnum {
    return this.value;
  }

  equals(other: BookingStatus): boolean {
    return this.value === other.toEnum();
  }

  toBooked(): BookingStatus {
    if (this.value !== BookingStatusEnum.PENDING) {
      throw new Error(`Cannot transition from ${this.value} to BOOKED`);
    }
    return BookingStatus.Booked;
  }

  toConfirmed(): BookingStatus {
    if (
      ![BookingStatusEnum.BOOKED, BookingStatusEnum.PENDING].includes(
        this.value,
      )
    ) {
      throw new Error(`Cannot transition from ${this.value} to CONFIRMED`);
    }
    return BookingStatus.Confirmed;
  }

  toCancelled(): BookingStatus {
    if (
      [BookingStatusEnum.COMPLETED, BookingStatusEnum.CANCELLED].includes(
        this.value,
      )
    ) {
      throw new Error(`Cannot transition from ${this.value} to CANCELLED`);
    }
    return BookingStatus.Canceled;
  }

  toRejected(): BookingStatus {
    if (this.value !== BookingStatusEnum.PENDING) {
      throw new Error(`Cannot transition from ${this.value} to REJECTED`);
    }
    return BookingStatus.Rejected;
  }

  toCompleted(): BookingStatus {
    if (this.value !== BookingStatusEnum.CONFIRMED) {
      throw new Error(`Cannot transition from ${this.value} to COMPLETED`);
    }
    return BookingStatus.Completed;
  }

  toExpired(): BookingStatus {
    if (this.value === BookingStatusEnum.EXPIRED) {
      console.log('isExpired');
      return this;
    }
    if (
      ![BookingStatusEnum.PENDING, BookingStatusEnum.BOOKED].includes(
        this.value,
      )
    ) {
      throw new Error(`Cannot transition from ${this.value} to EXPIRED`);
    }
    return BookingStatus.Expired;
  }

  toFailed(): BookingStatus {
    if (
      ![
        BookingStatusEnum.PENDING,
        BookingStatusEnum.BOOKED,
        BookingStatusEnum.CONFIRMED,
      ].includes(this.value)
    ) {
      throw new Error(`Cannot transition from ${this.value} to FAILED`);
    }
    return BookingStatus.Failed;
  }
}
