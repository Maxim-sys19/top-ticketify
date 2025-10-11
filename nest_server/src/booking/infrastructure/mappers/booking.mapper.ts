import { Booking } from '../../domain/booking';
import { Booking as OrmBookingEntity } from 'src/entities/booking/booking.entity';
import { BookingStatus } from 'src/booking/domain/value-objects/BookingStatus';

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
      orm.seatIds = domain.seatIds;
      orm.bookingTime = domain.bookingTime;
      orm.expirationTime = domain.expirationTime;
      orm.status = domain.status.toEnum();
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
      orm.seatIds,
      orm.bookingTime,
      orm.expirationTime,
      BookingStatus.from(orm.status),
    );
  }
}
