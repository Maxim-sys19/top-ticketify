import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  LockSeatCommand,
  ReturnLockSeatCommandType,
} from 'src/seat/application/commands/lock.seat.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result, ResultSuccessType } from 'src/shared/result';
import { SeatTransport } from 'src/entities/seat/seat.transport';
import { SeatLockedEvent } from 'src/seat/domain/events/seat.locked.event';

@CommandHandler(LockSeatCommand)
export class LockSeatCommandHandler
  implements ICommandHandler<LockSeatCommand>
{
  constructor(
    @InjectRepository(SeatTransport)
    private readonly seatRepository: Repository<SeatTransport>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: LockSeatCommand,
  ): Promise<ResultSuccessType<ReturnLockSeatCommandType>> {
    console.log('LockSeatCommandHandler executed :', command);
    const { seatIds, expiresAt, bookingId, userId } = command;
    try {
      const existingSeats = await this.seatRepository
        .createQueryBuilder('seat')
        .where('seat.id IN (:...seatIds)', { seatIds })
        .getMany();
      if (existingSeats.length !== seatIds.length) {
        const existingIds = existingSeats.map((s) => s.id);
        const missingIds = seatIds.filter((id) => !existingIds.includes(id));
        throw new Error(`Seats with ID: ${missingIds.join(', ')} not found`);
      }
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
        throw new Error(`Seats not found : ${seatIds.join(', ')}`);
      }
      await this.eventBus.publish(
        new SeatLockedEvent(bookingId, seatIds, userId, expiresAt),
      );
      return Result.ok({ success: true });
    } catch (err) {
      throw err;
    }
  }
}
