import { DomainRepository } from 'src/shared/common/repository/domain.repository';
import { Booking as BookingDomain } from '../../domain/booking';
import { Booking as BookingEntity } from '../../../entities/booking/booking.entity';

export abstract class BookingRepository extends DomainRepository<
  BookingDomain,
  BookingEntity
> {}
