import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from 'src/entities/seat/seat.entity';
import { ReleaseSeatsCommandHandler } from 'src/seat/application/commands/handlers/release.seats.command.handler';
import { LockSeatCommandHandler } from 'src/seat/application/commands/handlers/lock.seat.command.handler';
import { SeatTransport } from 'src/entities/seat/seat.transport';

@Module({
  imports: [TypeOrmModule.forFeature([Seat, SeatTransport])],
  controllers: [SeatController],
  providers: [SeatService, ReleaseSeatsCommandHandler, LockSeatCommandHandler],
})
export class SeatModule {}
