export class SeatLockedEvent {
  constructor(
    readonly bookingId: string,
    readonly seatIds: string[],
    readonly userId: string,
    readonly expiresAt: Date,
  ) {}
}
