export class BookingBookedApplicationEvent {
  constructor(
    public readonly bookingId: string,
    public readonly userId: string,
    public readonly amount?: string,
  ) {}
}
