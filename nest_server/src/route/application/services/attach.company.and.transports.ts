import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { RouteTransport } from 'src/entities/route/route.transport';
import {
  CompanyTransportsDto,
  TransportSeatsDto,
} from 'src/route/application/dto/create-route.dto';
import { SeatTransport } from 'src/entities/seat/seat.transport';
import { TransportCompany } from 'src/entities/transport/transport.company';
import { CompanyTransports } from 'src/entities/company/company.transports';

@Injectable()
export class AttachCompanyAndTransports {
  constructor(private readonly entityManager: EntityManager) {}
  async attachTransportAndCompany(
    route: RouteTransport,
    company: CompanyTransportsDto,
    transports: TransportSeatsDto[],
  ) {
    const { id } = company;
    try {
      const transportsSeats = await Promise.all(
        transports.map(async (t) => {
          const transportEntity = await this.entityManager.findOneOrFail(
            TransportCompany,
            {
              where: { id: t.id },
            },
          );
          const seats = await this.entityManager.find(SeatTransport, {
            where: { id: In(t.seatIds) },
          });
          transportEntity.seats = seats;
          return transportEntity;
        }),
      );
      const cp = await this.entityManager.findOne(CompanyTransports, {
        where: { id },
      });
      cp.transports = transportsSeats;
      route.company = cp;
      return route;
    } catch (err) {
      throw err;
    }
  }
}
