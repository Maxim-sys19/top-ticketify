import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockSeatCommand } from 'src/seat/application/commands/lock.seat.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from 'src/shared/result';
import { SeatTransport } from 'src/entities/seat/seat.transport';

@CommandHandler(LockSeatCommand)
export class LockSeatCommandHandler
  implements ICommandHandler<LockSeatCommand>
{
  constructor(
    @InjectRepository(SeatTransport)
    private readonly seatRepository: Repository<SeatTransport>,
  ) {}

  async execute(command: LockSeatCommand): Promise<Result<any>> {
    const { seatIds, expiresAt, bookingId } = command;
    try {
      const updatedAvailableSeats = await this.seatRepository
        .createQueryBuilder()
        .update()
        .set({
          isAvailable: false,
          locked_until: expiresAt,
          looked_by_booking: bookingId,
        })
        .whereInIds(seatIds)
        .andWhere(
          '(looked_by_booking IS NULL OR looked_by_booking = :bookingId)',
          { bookingId },
        )
        .execute();
      if (updatedAvailableSeats.affected === 0) {
        return Result.fail(`Seats not found : ${seatIds.join(', ')}`);
      }
      return Result.ok({ success: true });
    } catch (err) {
      console.log('UPDATESEAT ERR :', err);
    }
  }
}
