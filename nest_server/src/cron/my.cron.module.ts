import { Module } from '@nestjs/common';
import { MyCronServiceTsService } from './my.cron.service.ts.service';
import { ConfigModule } from '@nestjs/config';
import { loadYamlConfig } from './load.yaml.config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ResetExpiredPwdService } from './reset.expired.pwd.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from '../entities/reset.password.token.entity';
import { CronJobProvider } from './cron.job.provider';
import { CompanyCronService } from './company.cron.service';
import { CompanyUser } from 'src/entities/user/company.user';
import { Company } from 'src/entities/company/company.entity';
import { CompanyTransports } from '../entities/company/company.transports';
import { BookingExpirationWorker } from 'src/booking/application/services/booking.expiration.worker';
import { Booking } from 'src/entities/booking/booking.entity';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';
import { BookingRepositoryImpl } from 'src/booking/infrastructure/repositories/booking.repository.impl';
import { OutboxEntity } from 'src/entities/outbox/infrastructure/outbox.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [loadYamlConfig] }),
    TypeOrmModule.forFeature([
      ResetPasswordToken,
      CompanyUser,
      Company,
      CompanyTransports,
      Booking,
      OutboxEntity,
    ]),
  ],
  providers: [
    { provide: BookingRepository, useClass: BookingRepositoryImpl },
    SchedulerRegistry,
    MyCronServiceTsService,
    ResetExpiredPwdService,
    BookingExpirationWorker,
    CompanyCronService,
    CronJobProvider,
  ],
  exports: [MyCronServiceTsService],
})
export class MyCronModule {}
