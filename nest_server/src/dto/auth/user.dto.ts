import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class UserDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(8)
  password: string;
  @Match('password')
  confirm_password?: string;
}
