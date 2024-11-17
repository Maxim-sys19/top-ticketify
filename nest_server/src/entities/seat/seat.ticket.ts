import { ChildEntity, OneToOne } from 'typeorm';
import { Seat } from './seat.entity';
import { TicketSeat } from '../ticket/ticket.seat';

@ChildEntity()
export class SeatTicket extends Seat {
  @OneToOne(() => TicketSeat, (ticket) => ticket.seat, { onDelete: 'CASCADE' })
  ticket: TicketSeat;
}
