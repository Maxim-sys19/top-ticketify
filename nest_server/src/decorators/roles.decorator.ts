import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/role.enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
