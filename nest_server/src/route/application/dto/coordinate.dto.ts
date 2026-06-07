import { IsNumber } from 'class-validator';

export class CoordinateDto {
  @IsNumber()
  lat: number;
  @IsNumber()
  lng: number;
}
