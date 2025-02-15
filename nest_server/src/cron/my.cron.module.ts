import {Module} from '@nestjs/common';
import {MyCronServiceTsService} from './my.cron.service.ts.service';
import {ConfigModule} from '@nestjs/config';
import {loadYamlConfig} from './load.yaml.config';
import {SchedulerRegistry} from '@nestjs/schedule';
import {ResetExpiredPwdService} from './reset.expired.pwd.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ResetPasswordToken} from '../entities/reset.password.token.entity';
import {CronJobProvider} from './cron.job.provider';
import {CompanyCronService} from './company.cron.service';
import { CompanyUser } from 'src/entities/user/company.user';
import { Company } from 'src/entities/company/company.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [loadYamlConfig] }),
    TypeOrmModule.forFeature([ResetPasswordToken, CompanyUser, Company]),
  ],
  providers: [
    SchedulerRegistry,
    MyCronServiceTsService,
    ResetExpiredPwdService,
    CompanyCronService,
    CronJobProvider,
  ],
  exports: [MyCronServiceTsService],
})
export class MyCronModule {}
