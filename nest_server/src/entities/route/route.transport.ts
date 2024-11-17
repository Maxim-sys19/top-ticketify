import { ChildEntity, ManyToOne } from 'typeorm';
import { Route } from './route.entity';
import { TransportRoutes } from '../transport/transport.routes';

@ChildEntity()
export class RouteTransport extends Route {
  @ManyToOne(() => TransportRoutes, (transport) => transport.routes, {
    cascade: true,
  })
  transport: TransportRoutes;
}
