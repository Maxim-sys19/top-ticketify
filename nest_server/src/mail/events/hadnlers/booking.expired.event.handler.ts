import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingExpiredEvent } from 'src/booking/domain/events/booking.expired.event';
import { SendEmailBookingNotification } from 'src/mail/services/send.email.booking.notification';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@EventsHandler(BookingExpiredEvent)
export class BookingExpiredEventHandler
  implements IEventHandler<BookingExpiredEvent>
{
  constructor(
    private readonly notification: SendEmailBookingNotification,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async handle(event: BookingExpiredEvent) {
    try {
      console.log('BookingExpiredEventHandler  : ', event);
      const { id, userId } = event;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user)
        throw new NotFoundException(`User with ID: ${userId} not found`);
      await this.notification.sendBookingEmail({
        email: user.email,
        subject: 'Booking Expired',
        title: 'Booking expired',
        template: 'booking_expired',
        payload: {
          userName: user.name,
          bookingId: id,
        },
      });
    } catch (err) {
      console.log('Error BookingExpiredEventHandler :', err);
      throw err;
    }
  }
}
