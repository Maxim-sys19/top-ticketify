import { ChildEntity, ManyToOne } from 'typeorm';
import { Route } from './route.entity';
import { CompanyRoute } from '../company/company.routes';

@ChildEntity()
export class RouteCompany extends Route {
  @ManyToOne(() => CompanyRoute, (companyRoute) => companyRoute.routes)
  company: CompanyRoute;
}
