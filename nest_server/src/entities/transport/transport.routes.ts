import { ChildEntity, ManyToMany } from 'typeorm';
import { Transport } from './transport.entity';
import { RouteTransport } from '../route/route.transport';

@ChildEntity()
export class TransportRoutes extends Transport {
  @ManyToMany(() => RouteTransport, (route) => route.transports, {
    onDelete: 'CASCADE',
  })
  routes?: RouteTransport[];
}
