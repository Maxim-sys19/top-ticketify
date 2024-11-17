import { ChildEntity, OneToMany } from 'typeorm';
import { Transport } from './transport.entity';
import { RouteTransport } from '../route/route.transport';

@ChildEntity()
export class TransportRoutes extends Transport {
  @OneToMany(() => RouteTransport, (route) => route.transport, {
    onDelete: 'CASCADE',
  })
  routes: RouteTransport[];
}
