import { IsNotEmpty } from 'class-validator';

export class CompanyDto {
  @IsNotEmpty()
  company_name: string;
  @IsNotEmpty()
  company_description: string;
}
