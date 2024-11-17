import { ChildEntity, OneToMany } from 'typeorm';
import { TicketTransport } from '../ticket/ticket.transport';
import { Transport } from './transport.entity';

@ChildEntity()
export class TransportTicket extends Transport {
  @OneToMany(() => TicketTransport, (ticket) => ticket.transport, {
    onDelete: 'CASCADE',
  })
  tickets: TicketTransport[];
}
