import React, {memo} from 'react';
import {Form} from "react-bootstrap";

type Option = {
  label: string;
  value: string | number;
}
interface BaseSelectProps{
  label? :string;
  options? : Option[];
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  field: any,
  selectValues?: any[],
}

function Select({onChange, value, field, selectValues}: BaseSelectProps) {
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