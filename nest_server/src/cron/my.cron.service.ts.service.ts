import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class MyCronServiceTsService implements OnModuleDestroy {
  private readonly logger = new Logger(MyCronServiceTsService.name);
  private jobs: Record<string, CronJob> = {};

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject('CRON_JOB_CONFIG') private readonly cronJobConfig: any[],
  ) {
    this.loadCronJobs();
  }

  private loadCronJobs() {
    this.cronJobConfig.forEach((jobConf) => {
      this.addCronJob(jobConf.name, jobConf.cronTime, jobConf.callback);
    });
  }

  addCronJob(name: string, cronTime: string, callback: () => void) {
    const job = new CronJob(cronTime, callback);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    console.log(`Cron job ${name}: added and started`);
  }

  removeCronJob(name: string) {
    const job = this.schedulerRegistry.getCronJob(name);
    job.stop();
    this.schedulerRegistry.deleteCronJob(name);
    console.log(`Cron job ${name} removed`);
  }

  clearAllCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      this.logger.log(`Deleting cron job: ${key}`);
      this.schedulerRegistry.deleteCronJob(key);
    });
    console.log('All cron jobs cleared.');
  }

  onModuleDestroy(): any {
    this.clearAllCronJobs();
  }
}
