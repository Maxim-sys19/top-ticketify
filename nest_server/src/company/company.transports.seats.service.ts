import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CompanyTransports } from 'src/entities/company/company.transports';

@Injectable()
export class CompanyTransportsSeatsService {
  constructor(private readonly entityManager: EntityManager) {}
  async getTransportsSeatsBelongCompany() {
    return this.entityManager
      .createQueryBuilder(CompanyTransports, 'company')
      .leftJoin('company.transports', 'transport')
      .leftJoin('transport.seats', 'seats')
      .select([
        'company.id',
        'company.name',
        'transport.id',
        'transport.name',
        'seats.id',
        'seats.title',
      ])
      .getMany();
  }
}
