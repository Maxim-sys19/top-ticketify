import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendBookingCreatedEmailCommand } from 'src/mail/commands/send.booking.created.email.command';

@CommandHandler(SendBookingCreatedEmailCommand)
export class SendBookingCreatedEmailCommandHandler
  implements ICommandHandler<SendBookingCreatedEmailCommand>
{
  execute(command: SendBookingCreatedEmailCommand): Promise<any> {
    console.log('SendBookingCreatedEmailCommand command :', command);
    throw new Error(
      'SendBookingCreatedEmailCommandHandler Method not implemented.',
    );
  }
}
