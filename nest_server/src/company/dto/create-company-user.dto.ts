import { ValidateNested } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UserDto } from '../../dto/auth/user.dto';
import { Type } from 'class-transformer';
import { CompanyDto } from './company.dto';
import { RolesDto } from '../../dto/roles/roles.dto';

export class CreateCompanyUserDto extends OmitType(PartialType(UserDto), [
  'confirm_password',
] as const) {
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
  @ValidateNested()
  @Type(() => RolesDto)
  roles: RolesDto;
}
