import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  reset_token: string;
  @MinLength(8)
  old_password: string;
  @MinLength(8)
  new_password: string;
}