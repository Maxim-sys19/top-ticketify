import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking as OrmBookingEntity } from '../../../entities/booking/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingMapper } from '../mappers/booking.mapper';
import { Booking } from '../../domain/booking';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingRepositoryImpl implements BookingRepository {
  constructor(
    @InjectRepository(OrmBookingEntity)
    private readonly repository: Repository<OrmBookingEntity>,
  ) {}
  async save(booking: Booking): Promise<OrmBookingEntity> {
    const orm = BookingMapper.toOrm(booking);
    return await this.repository.save(orm);
  }
  async findById(id: string): Promise<Booking> {
    const orm = await this.repository.findOne({ where: { id } });
    if (!orm) return null;
    return BookingMapper.toDomain(orm);
  }
}
