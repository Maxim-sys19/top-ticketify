import { ChildEntity, ManyToOne } from 'typeorm';
import { TransportTicket } from '../transport/transport.ticket';
import { Ticket } from './ticket.entity';

@ChildEntity()
export class TicketTransport extends Ticket {
  @ManyToOne(() => TransportTicket, (transport) => transport.tickets, {
    cascade: true,
  })
  transport: TransportTicket;
}
