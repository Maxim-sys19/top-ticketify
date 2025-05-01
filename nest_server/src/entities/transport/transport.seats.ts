import { ChildEntity, OneToMany } from 'typeorm';
import { SeatTransport } from '../seat/seat.transport';
import { TransportRoutes } from './transport.routes';

@ChildEntity()
export class TransportSeats extends TransportRoutes {
  @OneToMany(() => SeatTransport, (seat) => seat.transport, {
    cascade: true,
  })
  seats: SeatTransport[];
}
