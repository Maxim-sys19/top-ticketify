import { TransportCompany } from '../transport/transport.company';
import { ChildEntity, OneToMany } from 'typeorm';
import { CompanyRoute } from './company.routes';

@ChildEntity()
export class CompanyTransports extends CompanyRoute {
  @OneToMany(() => TransportCompany, (transport) => transport.company, {
    cascade: true,
  })
  transports?: TransportCompany[];
}
