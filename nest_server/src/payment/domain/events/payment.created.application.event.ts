export class PaymentCreatedApplicationEvent {
  constructor(
    public readonly paymentIntentId: string,
    public readonly bookingId: string,
  ) {}
}
