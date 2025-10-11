import React, {JSX, memo, useEffect} from 'react';
import {FormComponentPropTypes} from "./FormComponentPropTypes";
import {Button, Form} from "react-bootstrap";
import Input from "../Input/Input";
import Select from "../Select/Select";
import DateTimePicker from '../DateTimePicker/DateTimePicker';
import {useFormHandlers} from "../../hooks/useFormHandlers";

const BaseForm = <T extends Record<string, any>>(props: any) => {
  // console.log('BaseForm')
  const {
    fields,
    values,
    onChange,
    selectValues,
    onSubmit,
    memoHandleDateChange,
    buttonSubmitTitle,
    loading,
    errors,
  } = props;
  return (
    <Form onSubmit={onSubmit}>
      {
        errors?.map((error: any, index: any) => (
          <span className="text-danger" key={index}>{error.message}<br /></span>
        ))
      }
      {fields.map((field: any, index: any) => (
        <div key={index}>
          {
            field.inputType === 'select' &&
            <Select selectValues={selectValues} field={field} onChange={onChange}
                    value={values[field?.name] ?? ''} />
          }
          {
            field.inputType === 'datetime-local' &&
            <DateTimePicker
              value={values[field?.name as keyof typeof values] ? new Date(values[field?.name as keyof typeof values]) : null}
              label={field.label}
              onChange={memoHandleDateChange(field.name as keyof T)}
            />
          }
          {
            (field.inputType === 'input' || field.inputType === 'textarea') && (
              <Input field={field} onChange={onChange} value={values[field?.name] ?? ''} />)
          }
        </div>
      ))}
      <Button className="mt-3 float-sm-start" type="submit">
        {loading ? 'loading...' : buttonSubmitTitle}
      </Button>
    </Form>
  )
}

const MemoBaseForm = memo(BaseForm) as <T extends any>(props: any) => JSX.Element;

export default MemoBaseForm;