import { PartialType } from '@nestjs/mapped-types';
import { CompanyDto } from './company.dto';

export class UpdateCompany extends PartialType(CompanyDto) {}
