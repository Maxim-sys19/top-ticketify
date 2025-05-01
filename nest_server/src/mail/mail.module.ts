import { Module } from '@nestjs/common';
import { MailConfigService } from './mail.config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailServiceController } from './mail.service.controller';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfigService,
      inject: [MailConfigService],
    }),
  ],
  controllers: [MailServiceController],
  providers: [MailConfigService, MailService],
  exports: [MailService],
})
export class MailModule {}
