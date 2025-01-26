import React from 'react';
import {Form} from "react-bootstrap";

const Input = ({field, onChange, values}: any) => {
  return (
    <Form.Group className="mb-3">
      <Form.Control
        as={field.inputType}
        hidden={field.name === 'reset_token' || field.type === 'select'}
        type={field.type}
        name={field.name}
        id={field.name}
        placeholder={field.placeholder}
        onChange={onChange}
        value={values[field.name]}
        min="1"
      />
      <Form.Control.Feedback type="invalid">Invalid {field.name}</Form.Control.Feedback>
    </Form.Group>
  )
};

export default Input;