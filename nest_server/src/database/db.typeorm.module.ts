import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user/user.entity';
import { Role } from '../entities/role/role.entity';
import { Company } from '../entities/company/company.entity';
import { ResetPasswordToken } from '../entities/reset.password.token.entity';
import { CompanyUser } from '../entities/user/company.user';
import { UserRoles } from '../entities/user/user.roles.entity';
import { Transport } from '../entities/transport/transport.entity';
import { Ticket } from '../entities/ticket/ticket.entity';
import { TransportTicket } from '../entities/transport/transport.ticket';
import { TicketTransport } from '../entities/ticket/ticket.transport';
import { Seat } from '../entities/seat/seat.entity';
import { SeatTransport } from '../entities/seat/seat.transport';
import { TransportSeats } from '../entities/transport/transport.seats';
import { Route } from '../entities/route/route.entity';
import { RouteCompany } from '../entities/route/route.company';
import { CompanyRoute } from '../entities/company/company.routes';
import { TicketRoute } from '../entities/ticket/ticket.route';
import { TransportRoutes } from '../entities/transport/transport.routes';
import { RouteTransport } from '../entities/route/route.transport';
import { RouteTickets } from '../entities/route/route.tickets';
import { TicketSeat } from '../entities/ticket/ticket.seat';
import { SeatTicket } from '../entities/seat/seat.ticket';
import { TransportCompany } from '../entities/transport/transport.company';
import { CompanyTransports } from '../entities/company/company.transports';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user_name'),
        password: configService.get('db_user_password'),
        database: configService.get('database'),
        entities: [
          User,
          UserRoles,
          Role,
          ResetPasswordToken,
          Company,
          CompanyRoute,
          CompanyUser,
          CompanyTransports,
          Transport,
          TransportTicket,
          TransportSeats,
          TransportRoutes,
          TransportCompany,
          Ticket,
          TicketSeat,
          TicketRoute,
          TicketTransport,
          Seat,
          SeatTransport,
          SeatTicket,
          Route,
          RouteTransport,
          RouteTickets,
          RouteCompany,
        ],
        connectTimeout: 10000,
        retryAttempts: 5,
        retryDelay: 3000,
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbTypeormModule {}
