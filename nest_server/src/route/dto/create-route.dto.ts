import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { CoordinateDto } from './coordinate.dto';

export class CreateRouteDto {
  @IsNotEmpty()
  routeName: string;
  @ValidateNested({ message: 'please apply location for start' })
  @Type(() => CoordinateDto)
  start: CoordinateDto;
  @ValidateNested({ message: 'please apply location for end' })
  @Type(() => CoordinateDto)
  end: CoordinateDto;
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  path: CoordinateDto[];
  @IsDate()
  @Type(() => Date)
  departureTime: Date;
  @IsDate()
  @Type(() => Date)
  arrivalTime: Date;
}
