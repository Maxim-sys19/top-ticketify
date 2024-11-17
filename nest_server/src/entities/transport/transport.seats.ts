import { ChildEntity, OneToMany } from 'typeorm';
import { Transport } from './transport.entity';
import { SeatTransport } from '../seat/seat.transport';

@ChildEntity()
export class TransportSeats extends Transport {
  @OneToMany(() => SeatTransport, (seat) => seat.transport, {
    cascade: true,
  })
  seats: SeatTransport[];
}
