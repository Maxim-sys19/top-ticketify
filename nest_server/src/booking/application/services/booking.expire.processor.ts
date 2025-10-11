import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from 'src/ampq/rabbitmq.service';
import { CommandBus } from '@nestjs/cqrs';
import { ExpiredBookingCommand } from 'src/booking/application/commands/expired.booking.command';

@Injectable()
export class BookingExpireProcessor implements OnModuleInit {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly commandBus: CommandBus,
  ) {}
  async onModuleInit() {
    const queue = 'booking.expire.queue';
    try {
      await this.rabbitmqService.consume(queue, async (msg) => {
        if (!msg) return;
        try {
          const { data } = JSON.parse(msg.content.toString());
          await this.commandBus.execute(
            new ExpiredBookingCommand(
              data.bookingId,
              data.userId,
              data.seatIds,
            ),
          );
          await this.rabbitmqService.ack(msg);
        } catch (err) {
          console.log('Error to handle queue msg :', err);
          await this.rabbitmqService.nack(msg, true);
        }
      });
    } catch (err) {
      console.log('Error consume :', err);
      throw err;
    }
  }
}
