import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ReleaseSeatsCommand } from 'src/booking/application/commands/release.seats.command';
import { In, Repository } from 'typeorm';
import { Seat } from 'src/entities/seat/seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

@CommandHandler(ReleaseSeatsCommand)
export class ReleaseSeatsCommandHandler
  implements ICommandHandler<ReleaseSeatsCommand>
{
  private readonly logger = new Logger(ReleaseSeatsCommandHandler.name);
  constructor(
    @InjectRepository(Seat) private readonly seatRepository: Repository<Seat>,
  ) {}
  async execute(command: ReleaseSeatsCommand) {
    try {
      console.log('ReleaseSeatsCommandHandler exec :', command);
      const updatedSeats = await this.seatRepository
        .createQueryBuilder()
        .update()
        .set({
          isAvailable: true,
          locked_until: null,
          looked_by_booking: null,
        })
        .whereInIds(command.seatIds)
        .execute();
      console.log('Seats released : ', updatedSeats);
    } catch (err) {
      console.log('Error ReleaseSeatsCommandHandler : ', err);
      throw err;
    }
  }
}
