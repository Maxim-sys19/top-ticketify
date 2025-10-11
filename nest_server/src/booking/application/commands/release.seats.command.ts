import { Command } from '@nestjs/cqrs';

export class ReleaseSeatsCommand extends Command<any> {
  constructor(public readonly seatIds: string[]) {
    super();
  }
}
