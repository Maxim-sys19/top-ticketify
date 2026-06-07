type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'datetime-local' | 'optgroup' | 'option';

export interface Field {
  name: string;
  inputType?: string
  label: string;
  type: FieldType;
  placeholder?: string;
  children?: Field[]
}