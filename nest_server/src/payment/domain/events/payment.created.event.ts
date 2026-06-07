export class PaymentCreatedEvent {
  constructor(
    public readonly paymentIntentId: string,
    public readonly bookingId: string,
  ) {}
}
