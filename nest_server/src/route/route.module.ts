import { Module } from '@nestjs/common';
import { RouteService } from './application/services/route.service';
import { RouteController } from './presentation/controllers/route.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../entities/route/route.entity';
import { GoogleMapsModule } from 'src/google-maps/google-maps.module';
import { RouteTransport } from 'src/entities/route/route.transport';
import { AttachCompanyAndTransports } from 'src/route/application/services/attach.company.and.transports';
import { Company } from 'src/entities/company/company.entity';
import { Transport } from 'src/entities/transport/transport.entity';
import { Seat } from 'src/entities/seat/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route, Seat, Company, Transport, RouteTransport]),
    GoogleMapsModule,
  ],
  controllers: [RouteController],
  providers: [RouteService, AttachCompanyAndTransports],
})
export class RouteModule {}
