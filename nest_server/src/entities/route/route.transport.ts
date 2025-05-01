import { ChildEntity, ManyToMany } from 'typeorm';
import { TransportRoutes } from '../transport/transport.routes';
import { RouteCompany } from './route.company';

@ChildEntity()
export class RouteTransport extends RouteCompany {
  @ManyToMany(() => TransportRoutes, (transport) => transport.routes, {
    cascade: ['insert', 'update'],
  })
  transports?: TransportRoutes[];
}
