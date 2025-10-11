export class BookingBookedEvent {
  constructor(
    public readonly userId: string,
    public readonly routeId: string | number,
    public readonly seatId: string | number,
    public readonly transportId: string | number,
    public readonly bookingId: string | number,
    public readonly bookingTime: string | Date
  ) {
  }
}