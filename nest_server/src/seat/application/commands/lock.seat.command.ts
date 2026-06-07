import { Command } from '@nestjs/cqrs';
import { ResultSuccessType } from 'src/shared/result';
export type ReturnLockSeatCommandType = { success: boolean };
export type ReturnCommandType<U> = ResultSuccessType<U> | U;
export class LockSeatCommand extends Command<
  ReturnCommandType<ReturnLockSeatCommandType>
> {
  constructor(
    public readonly seatIds: string[],
    public readonly bookingId: string,
    public readonly expiresAt: Date,
    public readonly userId: string,
  ) {
    super();
  }
}
