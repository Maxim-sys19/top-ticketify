import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ArrayNotEmpty,
  Min,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CoordinateDto } from './coordinate.dto';

export class TransportSeatsDto {
  @IsNumber()
  @Min(1, { message: 'transport is required' })
  id: number;
  @IsArray()
  @ArrayNotEmpty({ message: 'seats cannot be empty' })
  @IsString({ each: true })
  seatIds: string[];
}

export class CompanyTransportsDto {
  @IsNotEmpty()
  @Min(1, { message: 'company is required' })
  id: number;
}

export class CreateRouteDto {
  @IsNotEmpty()
  routeName: string;
  @ValidateNested({ message: 'please apply location for start' })
  @Type(() => CoordinateDto)
  start: CoordinateDto;
  @ValidateNested({ message: 'please apply location for end' })
  @Type(() => CoordinateDto)
  end: CoordinateDto;
  @IsDate()
  @Type(() => Date)
  departureTime: Date;
  @IsDate()
  @Type(() => Date)
  arrivalTime: Date;
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyTransportsDto)
  company: CompanyTransportsDto;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransportSeatsDto)
  transports: TransportSeatsDto[];
}
