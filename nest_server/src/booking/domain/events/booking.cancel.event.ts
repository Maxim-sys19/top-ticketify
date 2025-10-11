export class BookingCancelEvent {
  constructor(public readonly id: string, public readonly userId: string) {
  }
}