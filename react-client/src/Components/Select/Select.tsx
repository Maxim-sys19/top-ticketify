import React, {memo} from 'react';
import {Form} from "react-bootstrap";

type Option = {
  label: string;
  value: string | number;
}
export interface BaseSelectProps{
  label? :string;
  options? : Option[];
  value: any
  onChange?: (e: any) => void;
  field: any,
  selectValues?: any[],
  multiple?: boolean;
}

function Select({onChange, value, field, selectValues}: BaseSelectProps) {
  console.log('Select')
  return (
    <Form.Select name={field?.name} onChange={onChange} value={value} aria-label="Default select example">
      <option value="">{field?.label}</option>
      {
        selectValues &&
        selectValues.map((value: string, idx: any) => <option key={idx} value={value}>{value}</option>)
      }
    </Form.Select>
  )
}

export default memo(Select) as (props: BaseSelectProps) => React.ReactElement;