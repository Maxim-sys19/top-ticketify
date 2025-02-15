import {Type} from "class-transformer";
import {IsDate, IsNotEmpty} from "class-validator";

export class CreateRouteDto {
  @IsNotEmpty()
  start: string;
  @IsNotEmpty()
  end: string;
  @IsDate()
  @Type(() => Date)
  departureTime: Date;
  @IsDate()
  @Type(() => Date)
  arrivalTime: Date;
}
