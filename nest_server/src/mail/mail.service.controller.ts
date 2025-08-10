import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class MailServiceController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('email.verification')
  async handleEmailVerification(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    const { user, token } = payload;
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.mailService.emailVerification(user, token);
      channel.ack(message);
    } catch (err: any) {
      console.log('Error consuming email verification', err);
      channel.nack(message);
    }
  }
  @EventPattern('email.resetPwd')
  async emailResetPwd(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ): Promise<{ messageId: string }> {
    const { user, generateToken } = payload;
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      const messageId = await this.mailService.emailResetPassword(
        user,
        generateToken,
      );
      channel.ack(message);
      return { messageId };
    } catch (err) {
      console.log('Error consuming email reset pwd :', err);
      channel.nack(message);
    }
  }
}
