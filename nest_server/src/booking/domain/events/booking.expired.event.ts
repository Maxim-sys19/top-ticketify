export class BookingExpiredEvent {
  constructor(
    public readonly id: string,
    public readonly seatIds: string[],
    public readonly userId: string,
  ) {}
}
