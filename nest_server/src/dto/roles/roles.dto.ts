import { IsNotEmpty } from 'class-validator';

export class RolesDto {
  @IsNotEmpty()
  role_name: string;
}
