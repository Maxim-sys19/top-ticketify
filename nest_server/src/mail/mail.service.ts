import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../entities/user/user.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async emailVerification(user: any, token: string): Promise<any> {
    try {
      const url = `http://localhost:8000/auth/email-comfirmation?token=${token}`;
      return await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Welcome to your app.  Confirm your email!',
          template: './email_verification',
          context: {
            name: user.name,
            url,
          },
        })
        .then((result) => {
          this.logger.log(`Mail sent - ${JSON.stringify(result.messageId)}`);
        });
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }
  async emailResetPassword(user: User, token: string): Promise<any> {
    try {
      const url = `http://localhost:3000/reset-password?token=${token}`;
      return await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Welcome to your app.  To reset your password!',
          template: './reset_password',
          context: {
            title: 'Reset password',
            name: user.name,
            url,
          },
        })
        .then(({ messageId }) => {
          return messageId;
        });
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
