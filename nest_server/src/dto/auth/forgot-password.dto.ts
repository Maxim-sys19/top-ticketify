import { UserDto } from './user.dto';
import { PickType } from '@nestjs/mapped-types';

export class ForgotPassword extends PickType(UserDto, ['email'] as const) {}
