import { ChildEntity, ManyToOne } from 'typeorm';
import { Seat } from './seat.entity';
import { TransportSeats } from '../transport/transport.seats';

@ChildEntity()
export class SeatTransport extends Seat {
  @ManyToOne(() => TransportSeats, (transport) => transport.seats, {
    onDelete: 'CASCADE',
  })
  transport: TransportSeats;
}
