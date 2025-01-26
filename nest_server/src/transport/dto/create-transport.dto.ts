import { IsNotEmpty, Min } from 'class-validator';

export class CreateTransportDto {
  @IsNotEmpty()
  transport_name: string;
  @IsNotEmpty()
  transport_description: string;
  @IsNotEmpty()
  @Min(2)
  capacity: number;
  @IsNotEmpty()
  company_name: string;
}
