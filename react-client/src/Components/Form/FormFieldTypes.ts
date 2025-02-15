type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'datetime-local';

export interface Field {
  name: string;
  inputType?: string
  label: string;
  type: FieldType;
  placeholder?: string;
}