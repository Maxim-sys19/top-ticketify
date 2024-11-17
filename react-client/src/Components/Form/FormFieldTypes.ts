type FieldType = 'text' | 'number' | 'email' | 'password';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}