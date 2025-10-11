import { Booking } from '../booking';
import { Booking as OrmBookingEntity } from 'src/entities/booking/booking.entity';

export abstract class BookingRepository {
  abstract save(booking: Booking): Promise<OrmBookingEntity>;
  abstract findById(id: string): Promise<Booking>;
}
