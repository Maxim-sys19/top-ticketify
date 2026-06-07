import { Provider } from '@nestjs/common';
import { ResetExpiredPwdService } from './reset.expired.pwd.service';
import { loadYamlConfig } from './load.yaml.config';
import { CompanyCronService } from './company.cron.service';
import { BookingExpirationWorker } from 'src/booking/application/services/booking.expiration.worker';
import { CronJobName } from './contracts/cron.job.contracts';

export const CronJobProvider: Provider = {
  provide: 'CRON_JOB_CONFIG',
  inject: [ResetExpiredPwdService, CompanyCronService, BookingExpirationWorker],
  useFactory: (
    resetExpiredPwdTokenService: ResetExpiredPwdService,
    companyCronService: CompanyCronService,
    checkExpiredBookingWorker: BookingExpirationWorker,
  ) => {
    const configYaml = loadYamlConfig();
    return configYaml.cronJobs.map((job) => ({
      id: job.id,
      name: job.name,
      cronTime: job.cronTime,
      callback: async () => {
        switch (job.name as CronJobName) {
          case CronJobName.RESET_PWD_EXPIRED_TOKEN:
            await resetExpiredPwdTokenService.deleteExpiredResetPwdToken();
            break;
          case CronJobName.DELETE_ALL_COMPANIES:
            await companyCronService.deleteAllCompanies();
            break;
          case CronJobName.CHECK_EXPIRE_BOOKING:
            await checkExpiredBookingWorker.checkExpireBooking();
        }
      },
    }));
  },
};
