import { Booking } from '../../domain/booking';
import { Booking as OrmBookingEntity } from '../../../entities/booking/booking.entity';

export class BookingMapper {
  static toOrm(domain: Booking): OrmBookingEntity {
    try {
      console.log('Booking mapper scope :');
      const orm = new OrmBookingEntity();
      orm.id = domain.id;
      orm.userId = domain.userId;
      orm.routeId = domain.routeId;
      orm.companyId = domain.companyId;
      orm.transportId = domain.transportId;
      orm.seatId = domain.seatId;
      orm.bookingTime = domain.bookingTime;
      orm.expirationTime = domain.expirationTime;
      orm.status = domain.status;
      return orm;
    } catch (error) {
      console.log('BookingMapper error :  ', error);
    }
  }
  static toDomain(orm: OrmBookingEntity): Booking {
    return new Booking(
      orm.id,
      orm.userId,
      orm.routeId,
      orm.companyId,
      orm.transportId,
      orm.seatId,
      orm.bookingTime,
      orm.expirationTime,
      orm.status,
    );
  }
}
