import React from 'react';
import {Form} from "react-bootstrap";

const Select = ({onChange, values, field, selectValues}: any) => {
  return (
    <Form.Select name={field.name} onChange={onChange} value={values[field.name]} aria-label="Default select example">
      <option value="">{field.label}</option>
      {
        selectValues &&
        selectValues.map((value: string, idx: any) => <option key={idx} value={value}>{value}</option>)
      }
    </Form.Select>
  )
}

export default Select;