import { Provider } from '@nestjs/common';
import { ResetExpiredPwdService } from './reset.expired.pwd.service';
import { loadYamlConfig } from './load.yaml.config';
import { CompanyCronService } from './company.cron.service';

export const CronJobProvider: Provider = {
  provide: 'CRON_JOB_CONFIG',
  inject: [ResetExpiredPwdService, CompanyCronService],
  useFactory: (
    resetExpiredPwdTokenService: ResetExpiredPwdService,
    companyCronService: CompanyCronService
  ) => {
    const configYaml = loadYamlConfig();
    return configYaml.cronJobs.map((job) => ({
      id: job.id,
      name: job.name,
      cronTime: job.cronTime,
      callback: async () => {
        switch (job.name) {
          case 'resetPwdExpiredToken':
            await resetExpiredPwdTokenService.deleteExpiredResetPwdToken();
            break;
          case 'deleteAllCompanies':
            await companyCronService.deleteAllCompanies()
            break;
        }
      },
    }));
  },
};