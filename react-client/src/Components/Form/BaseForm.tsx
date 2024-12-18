import React, {ChangeEvent, useEffect} from 'react';
import {FormComponentPropTypes} from "./FormComponentPropTypes";
import {Button, Form} from "react-bootstrap";
import Input from "../Input/Input";
import Select from "../Select/Select";

const BaseForm = <T extends Record<string, any>>(props: FormComponentPropTypes<T>) => {
  const {
    fields,
    selectValues,
    onSubmit,
    initialValue,
    buttonSubmitTitle,
    loading,
    done,
    errors,
  } = props;
  const [values, setValues] = React.useState<T>(initialValue);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValues({
      ...values,
      [name]: value
    });
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  }
  useEffect(() => {
    if (done) {
      setValues((prevState) => ({
        ...prevState,
        ...initialValue,
        initialValue,
      }));
    }
  }, [done, initialValue]);
  return (
    <Form onSubmit={handleSubmit}>
      {
        errors?.map((error, index) => (
          <span className="text-danger" key={index}>{error.message}<br /></span>
        ))
      }
      {fields.map((field, index) => (
        <div key={index}>
          {
            field.type === 'select' &&
            <Select selectValues={selectValues} field={field} onChange={handleChange} values={values}/>
          }
          <Input field={field} onChange={handleChange} values={values} />
        </div>
      ))}
      <Button className="mt-3 float-sm-start" type="submit">
        {loading ? 'loading...' : buttonSubmitTitle}
      </Button>
    </Form>
  )
}

export default BaseForm;