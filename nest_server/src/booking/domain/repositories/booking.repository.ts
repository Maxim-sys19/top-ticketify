import { Booking } from '../booking';

export abstract class BookingRepository {
  abstract save(booking: Booking): Promise<Booking>;
}
