import { IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransportDto {
  @IsNotEmpty()
  transport_name: string;
  @IsNotEmpty()
  transport_description: string;
  @IsNotEmpty()
  @Min(2)
  @Type(() => Number)
  capacity: number;
  @IsNotEmpty()
  company_name: string;
}
