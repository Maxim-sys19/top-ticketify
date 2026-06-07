import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';
import { CommandBus } from '@nestjs/cqrs';
import { ExpiredBookingCommand } from 'src/booking/application/commands/expired.booking.command';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';
import { BookingStatus } from 'src/booking/domain/value-objects/BookingStatus';

@Injectable()
export class BookingExpireProcessor implements OnModuleInit {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly commandBus: CommandBus,
    private readonly bookingRepository: BookingRepository,
  ) {}
  async onModuleInit() {
    console.log('BookingExpireProcessor');
    const queue = 'booking.expire.queue';
    const conn = await this.rabbitmqService.getConnection();
    const ch = await conn.createChannel();
    await ch.prefetch(10);
    try {
      await this.rabbitmqService.consume(ch, queue, async (msg) => {
        if (!msg) return;
        try {
          const { data } = JSON.parse(msg.content.toString());
          const booking = await this.bookingRepository.findById(data.bookingId);
          if (booking.status !== BookingStatus.Booked) {
            console.log('booking processor : EXpired');
            await this.rabbitmqService.ack(ch, msg);
            return;
          }
          await this.commandBus.execute(
            new ExpiredBookingCommand(
              data.bookingId,
              data.userId,
              data.seatIds,
              'rabbitmq',
            ),
          );
          await this.rabbitmqService.ack(ch, msg);
        } catch (err) {
          console.log('Error to handle queue msg :', err);
          await this.rabbitmqService.nack(ch, msg, false);
          throw err;
        }
      });
    } catch (err) {
      console.log('Error consume :', err);
      throw err;
    }
  }
}
