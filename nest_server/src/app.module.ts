import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { DbTypeormModule } from './database/db.typeorm.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { WinstonLoggerModule } from './logger/winston.logger.module';
import { MyCronModule } from './cron/my.cron.module';
import { CompanyModule } from './company/company.module';
import { MyRedisModule } from './redis/my.redis.module';
import { TransportModule } from './transport/transport.module';
import { TicketModule } from './ticket/ticket.module';
import { SeatModule } from './seat/seat.module';
import { RouteModule } from './route/route.module';
import { RabbitClientProxyModule } from './ampq/rabbit.client.proxy.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from 'src/payment/payment.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
    DbTypeormModule,
    MailModule,
    AuthModule,
    WinstonLoggerModule,
    MyCronModule,
    CompanyModule,
    MyRedisModule,
    TransportModule,
    TicketModule,
    SeatModule,
    RouteModule,
    RabbitClientProxyModule,
    BookingModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
