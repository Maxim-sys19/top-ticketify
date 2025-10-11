import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingCancelEvent } from 'src/booking/domain/events/booking.cancel.event';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendEmailBookingNotification } from 'src/mail/services/send.email.booking.notification';

@EventsHandler(BookingCancelEvent)
export class BookingCancelEventNotificationHandler
  implements IEventHandler<BookingCancelEvent>
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notification: SendEmailBookingNotification,
  ) {}
  async handle(event: BookingCancelEvent): Promise<any> {
    console.log('BookingCancelEventNotificationHandler exec :', event);
    const { id, userId } = event;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    try {
      await this.notification.sendBookingEmail({
        email: user.email,
        subject: 'Booking Cancelled',
        title: 'Booking cancelled',
        template: 'booking_cancelled',
        payload: {
          userName: user.name,
          bookingId: id,
        },
      });
    } catch (e) {
      console.log('BookingCancelEventNotificationHandler Error  :', e);
      throw e;
    }
  }
}
