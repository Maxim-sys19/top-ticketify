import { Module } from '@nestjs/common';
import { BookingController } from './presentation/controllers/booking.controller';
import { BookingRepositoryImpl } from './infrastructure/repositories/booking.repository.impl';
import { Booking as BookingOrmEntity } from '../entities/booking/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingRepository } from './domain/repositories/booking.repository';
import { CreateBookingCommandHandler } from 'src/booking/application/commands/handlers/create.booking.command.handler';
import { BookingExpireProcessor } from 'src/booking/application/services/booking.expire.processor';
import { ExpiredBookingCommandHandler } from 'src/booking/application/commands/handlers/expired.booking.command.handler';
import { BookingSagas } from 'src/sagas/booking.sagas';
import { ScheduleBookingExpireCommandHandler } from 'src/booking/application/commands/handlers/schedule.booking.expire.command.handler';
import { CancelledBookingCommandHandler } from 'src/booking/application/commands/handlers/cancelled.booking.command.handler';

@Module({
  imports: [TypeOrmModule.forFeature([BookingOrmEntity])],
  controllers: [BookingController],
  providers: [
    { provide: BookingRepository, useClass: BookingRepositoryImpl },
    CreateBookingCommandHandler,
    BookingSagas,
    ScheduleBookingExpireCommandHandler,
    BookingExpireProcessor,
    ExpiredBookingCommandHandler,
    CancelledBookingCommandHandler,
  ],
})
export class BookingModule {}
