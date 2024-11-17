import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from '../entities/transport/transport.entity';
import { Seat } from '../entities/seat/seat.entity';
import { TransportSeats } from '../entities/transport/transport.seats';

@Module({
  imports: [TypeOrmModule.forFeature([Transport, Seat, TransportSeats])],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
