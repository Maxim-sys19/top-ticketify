import { Provider } from '@nestjs/common';
import { ResetExpiredPwdService } from './reset.expired.pwd.service';
import { loadYamlConfig } from './load.yaml.config';

export const CronJobProvider: Provider = {
  provide: 'CRON_JOB_CONFIG',
  inject: [ResetExpiredPwdService],
  useFactory: (resetExpiredPwdTokenService: ResetExpiredPwdService) => {
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
          case 'job2':
            console.log('job2 executed every 2 minutes !');
            break;
        }
      },
    }));
  },
};