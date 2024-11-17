import { ChildEntity, OneToMany } from 'typeorm';
import { Route } from './route.entity';
import { TicketRoute } from '../ticket/ticket.route';

@ChildEntity()
export class RouteTickets extends Route {
  @OneToMany(() => TicketRoute, (ticketRoute) => ticketRoute.route)
  tickets: TicketRoute[];
}