import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  routeId: string;

  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  transportId: string;

  @IsNotEmpty()
  seatId: string;

  @IsDateString()
  bookingTime: string;
}
