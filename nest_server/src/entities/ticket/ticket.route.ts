import { ChildEntity, ManyToOne } from 'typeorm';
import { Ticket } from './ticket.entity';
import { RouteTickets } from '../route/route.tickets';

@ChildEntity()
export class TicketRoute extends Ticket {
  @ManyToOne(() => RouteTickets, (route) => route.tickets)
  route: RouteTickets;
}
