import { ChildEntity, OneToMany } from 'typeorm';
import { SeatTransport } from '../seat/seat.transport';
import { TransportCompany } from './transport.company';

@ChildEntity()
export class TransportSeats extends TransportCompany {
  @OneToMany(() => SeatTransport, (seat) => seat.transport, {
    cascade: true,
  })
  seats: SeatTransport[];
}
