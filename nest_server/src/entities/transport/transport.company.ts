import { Transport } from './transport.entity';
import { ChildEntity, ManyToOne } from 'typeorm';
import { CompanyTransports } from '../company/company.transports';
import { Company } from '../company/company.entity';

@ChildEntity()
export class TransportCompany extends Transport {
  @ManyToOne(() => CompanyTransports, (company) => company.transports)
  company: CompanyTransports | Company;
}
