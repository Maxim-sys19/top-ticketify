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
import { Route } from 'src/entities/route/route.entity';
import { BookingBookedCommandHandler } from 'src/booking/application/commands/handlers/booking.booked.command.handler';
import { OutboxRepository } from 'src/outbox/infrastructure/repository/outbox.repository';
import { OutboxRepositoryImpl } from 'src/outbox/infrastructure/repository/outbox.repository.impl';
import { OutboxEntity } from 'src/entities/outbox/infrastructure/outbox.entity';
import { OutboxProcessor } from './infrastructure/outbox/outbox.processor';
import { BookingBookedEventHandler } from './application/event-handlers/booking.booked.event.handler';

@Module({
  imports: [TypeOrmModule.forFeature([BookingOrmEntity, Route, OutboxEntity])],
  controllers: [BookingController],
  providers: [
    { provide: BookingRepository, useClass: BookingRepositoryImpl },
    { provide: OutboxRepository, useClass: OutboxRepositoryImpl },
    CreateBookingCommandHandler,
    BookingBookedCommandHandler,
    BookingSagas,
    ScheduleBookingExpireCommandHandler,
    BookingExpireProcessor,
    ExpiredBookingCommandHandler,
    CancelledBookingCommandHandler,
    BookingBookedEventHandler,
    OutboxProcessor,
  ],
})
export class BookingModule {}
