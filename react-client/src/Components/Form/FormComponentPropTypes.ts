import {Field} from "./FormFieldTypes";
import {ValidationError} from "../../helpers/parseErrors";

export interface FormComponentPropTypes<T> {
  buttonSubmitTitle: string;
  loading: boolean;
  fields: Field[],
  initialValue: T,
  selectValues?: string[]
  onSubmit: (value: T) => void,
  errors?: ValidationError[] | undefined
  done?: boolean | null,
}