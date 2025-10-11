import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  routeId: string;

  @IsNotEmpty()
  companyId: string;

  @IsNotEmpty()
  transportId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  seatIds: string[];

  @IsDateString()
  bookingTime: string;
}
