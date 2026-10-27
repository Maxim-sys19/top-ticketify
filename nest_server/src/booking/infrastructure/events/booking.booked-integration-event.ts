export class BookingBookendIntegrationEvent {
  constructor(
    readonly eventType: string,
    readonly aggregateId: string,
    readonly payload: {
      userId: string;
      bookingId: string;
      amount?: string | number;
    },
    readonly occuredAt: Date,
  ) {}
}
