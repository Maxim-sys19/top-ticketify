import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking as OrmBookingEntity } from '../../../entities/booking/booking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BookingMapper } from '../mappers/booking.mapper';
import { Booking } from '../../domain/booking';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingRepositoryImpl extends BookingRepository {
  constructor(
    @InjectRepository(OrmBookingEntity)
    private readonly repository: Repository<OrmBookingEntity>,
  ) {
    super();
  }
  async findWithConditions(
    conditions: FindManyOptions<OrmBookingEntity>,
  ): Promise<Booking[]> {
    const orm = await this.repository.find(conditions);
    if (!orm) return null;
    return orm.map((o) => BookingMapper.toDomain(o));
  }
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
