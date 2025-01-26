import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transport } from '../entities/transport/transport.entity';
import { Seat } from '../entities/seat/seat.entity';
import { TransportSeats } from '../entities/transport/transport.seats';
import { Company } from '../entities/company/company.entity';
import { TransportCompany } from '../entities/transport/transport.company';
import { SeatTransport } from '../entities/seat/seat.transport';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transport,
      Seat,
      SeatTransport,
      TransportSeats,
      Company,
      TransportCompany,
    ]),
  ],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
