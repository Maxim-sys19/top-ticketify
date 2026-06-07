import { IEvent } from '@nestjs/cqrs';

export class BookingCreatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly seatIds: string[],
    public readonly routeId: string,
    public readonly expiresAt: Date,
  ) {}
}
