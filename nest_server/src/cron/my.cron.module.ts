import { Module } from '@nestjs/common';
import { MyCronServiceTsService } from './my.cron.service.ts.service';
import { ConfigModule } from '@nestjs/config';
import { loadYamlConfig } from './load.yaml.config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ResetExpiredPwdService } from './reset.expired.pwd.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from '../entities/reset.password.token.entity';
import { CronJobProvider } from './cron.job.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [loadYamlConfig] }),
    TypeOrmModule.forFeature([ResetPasswordToken]),
  ],
  providers: [
    SchedulerRegistry,
    MyCronServiceTsService,
    ResetExpiredPwdService,
    CronJobProvider,
  ],
  exports: [MyCronServiceTsService],
})
export class MyCronModule {}
