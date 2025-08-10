import { Module } from '@nestjs/common';
import { BookingController } from './presentation/controllers/booking.controller';
import { BookingRepositoryImpl } from './infrastructure/repositories/booking.repository.impl';
import { Booking as BookingOrmEntity } from '../entities/booking/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateBookingUseCase } from './application/services/create.booking.use-case';
import { BookingRepository } from './domain/repositories/booking.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookingOrmEntity])],
  controllers: [BookingController],
  providers: [
    { provide: BookingRepository, useClass: BookingRepositoryImpl },
    {
      provide: CreateBookingUseCase,
      useFactory: (repository: BookingRepository) => {
        return new CreateBookingUseCase(repository);
      },
      inject: [BookingRepository],
    },
  ],
})
export class BookingModule {}
