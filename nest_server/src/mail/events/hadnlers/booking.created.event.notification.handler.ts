import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingCreatedEvent } from 'src/booking/domain/events/booking.created.event';
import { SendEmailBookingNotification } from 'src/mail/services/send.email.booking.notification';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@EventsHandler(BookingCreatedEvent)
export class BookingCreatedEventNotificationHandler
  implements IEventHandler<BookingCreatedEvent>
{
  constructor(
    private readonly notification: SendEmailBookingNotification,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async handle(event: BookingCreatedEvent) {
    const { id, expiresAt, userId } = event;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user)
      throw new NotFoundException(`User with ID : ${userId} is not found`);
    console.log('BookingCreatedEventNotificationHandler :', event);
    try {
      await this.notification.sendBookingEmail({
        email: user.email,
        subject: 'Booking Created',
        title: 'Booking created',
        template: 'booking_created',
        payload: {
          userName: user.name,
          bookingId: id,
          expiresAt,
        },
      });
    } catch (e) {
      console.log('BookingCreatedEventNotificationHandler Error  :', e);
      throw e;
    }
  }
}
