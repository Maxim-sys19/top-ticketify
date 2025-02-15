import { Company } from './company.entity';
import { TransportCompany } from '../transport/transport.company';
import { ChildEntity, OneToMany } from 'typeorm';

@ChildEntity()
export class CompanyTransports extends Company {
  @OneToMany(() => TransportCompany, (transport) => transport.company)
  transports: TransportCompany[];
}
