import { MailService } from 'src/mail/mail.service';
import { Injectable } from '@nestjs/common';
import { PayloadTypes } from 'src/mail/send.email.payload.types';

@Injectable()
export class SendEmailBookingNotification {
  constructor(private readonly mailService: MailService) {}
  async sendBookingEmail({
    email,
    subject,
    title,
    template,
    payload,
  }: PayloadTypes) {
    try {
      await this.mailService.emailBooking({
        email,
        subject,
        title,
        template,
        payload,
      });
    } catch (e) {
      console.log('SendEmailBookingNotification Error :', e);
      throw e;
    }
  }
}
