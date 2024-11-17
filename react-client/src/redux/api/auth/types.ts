import {ValidationError} from "../../../helpers/parseErrors";


export interface ErrorResponseTypes {
  status: number;
  data: {
    message?: string;
    errors: ValidationError[];
  }
}