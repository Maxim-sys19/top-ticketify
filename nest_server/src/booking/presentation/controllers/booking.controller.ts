import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateBookingDto } from '../../application/dto/create.booking.dto';
import { RolesGuard } from 'src/guards/rolesGuard';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBookingCommand } from 'src/booking/application/commands/create.booking.command';

@Controller('/booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  async createBooking(@Request() req: any, @Body() body: CreateBookingDto) {
    const { routeId, bookingTime, transportId, seatIds, companyId } = body;
    const { id } = req.user;
    return await this.commandBus.execute(
      new CreateBookingCommand(
        id,
        routeId,
        companyId,
        transportId,
        seatIds,
        bookingTime,
      ),
    );
  }
}
