import { CreateRouteDto } from './create-route.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateRouteDto extends OmitType(CreateRouteDto, [
  'company',
  'transports',
]) {}
