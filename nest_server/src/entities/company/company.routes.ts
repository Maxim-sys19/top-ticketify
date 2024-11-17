import { Company } from './company.entity';
import { ChildEntity, OneToMany } from 'typeorm';
import { RouteCompany } from '../route/route.company';

@ChildEntity()
export class CompanyRoute extends Company {
  @OneToMany(() => RouteCompany, (routeCompany) => routeCompany.company)
  routes: RouteCompany[];
}
