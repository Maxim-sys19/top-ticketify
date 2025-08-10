import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateBookingDto } from '../../application/dto/create.booking.dto';
import { RolesGuard } from '../../../guards/rolesGuard';
import { JwtAuthGuard } from '../../../guards/jwt.auth.guard';
import { CreateBookingUseCase } from '../../application/services/create.booking.use-case';

@Controller('/booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly createBookingUseCase: CreateBookingUseCase) {}
  @Post()
  async createBooking(@Request() req: any, @Body() body: CreateBookingDto) {
    const { id } = req.user;
    return await this.createBookingUseCase.execute(id, body);
  }
}
