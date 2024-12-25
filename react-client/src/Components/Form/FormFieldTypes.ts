type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea';

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}