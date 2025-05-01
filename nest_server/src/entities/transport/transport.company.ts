import { ChildEntity, ManyToOne } from 'typeorm';
import { CompanyTransports } from '../company/company.transports';
import { TransportSeats } from './transport.seats';

@ChildEntity()
export class TransportCompany extends TransportSeats {
  @ManyToOne(() => CompanyTransports, (company) => company.transports, {
    onDelete: 'CASCADE',
  })
  company: CompanyTransports;
}
