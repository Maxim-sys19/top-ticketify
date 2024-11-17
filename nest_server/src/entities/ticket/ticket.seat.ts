import { ChildEntity, OneToOne } from 'typeorm';
import { Ticket } from './ticket.entity';
import { SeatTicket } from '../seat/seat.ticket';

@ChildEntity()
export class TicketSeat extends Ticket {
  @OneToOne(() => SeatTicket, (seat) => seat.ticket, { cascade: true })
  seat: SeatTicket;
}
