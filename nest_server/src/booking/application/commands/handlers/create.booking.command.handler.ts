import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from 'src/booking/application/commands/create.booking.command';
import { BookingRepository } from 'src/booking/domain/repositories/booking.repository';
import { BookingPropTypes } from 'src/booking/domain/types/booking.prop.types';
import { Booking } from 'src/booking/domain/booking';
import {
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@CommandHandler(CreateBookingCommand)
export class CreateBookingCommandHandler
  implements ICommandHandler<CreateBookingCommand>
{
  private readonly logger = new Logger(CreateBookingCommandHandler.name);
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: CreateBookingCommand,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const inputDto: BookingPropTypes = {
        userId: command.userId,
        routeId: command.routeId,
        companyId: command.companyId,
        transportId: command.transportId,
        seatIds: command.seatIds,
        bookingTime: new Date(command.bookingTime),
      };
      const booking = this.eventPublisher.mergeObjectContext(
        Booking.create(inputDto),
      );
      const bookingCreated = await this.bookingRepository.save(booking);
      booking.commit();
      this.logger.log(`Booking created with success: ${bookingCreated.id}`);
      return { success: true, message: 'Booking create successfully' };
    } catch (error) {
      console.log('CreateBookingCommand err :', error);
      if (error instanceof QueryFailedError) {
        this.logger.error(error.message, {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          stack: error.stack,
        });
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Failed to create booking',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
