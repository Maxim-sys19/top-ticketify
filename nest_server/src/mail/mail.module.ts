import { Module } from '@nestjs/common';
import { MailConfigService } from './mail.config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailServiceController } from './mail.service.controller';
import { BookingExpiredEventHandler } from 'src/mail/events/hadnlers/booking.expired.event.handler';
import { SendEmailBookingNotification } from 'src/mail/services/send.email.booking.notification';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { BookingCancelEventNotificationHandler } from 'src/mail/events/hadnlers/booking.cancel.event.notification.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
      inject: [MailConfigService],
    }),
  ],
  controllers: [MailServiceController],
  providers: [
    MailConfigService,
    MailService,
    SendEmailBookingNotification,
    BookingExpiredEventHandler,
    BookingCancelEventNotificationHandler,
  ],
  exports: [MailService],
})
export class MailModule {}
