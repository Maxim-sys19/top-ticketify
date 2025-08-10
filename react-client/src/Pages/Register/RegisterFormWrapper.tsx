import React from 'react';
import {useRegistrationMutation} from "../../redux/api/auth/register.service";
import {parseErrors, ValidationError} from "../../helpers/parseErrors";
import {Field} from "../../Components/Form/FormFieldTypes";
import {Col, Row} from "react-bootstrap";
import BaseForm from "../../Components/Form/BaseForm";
import {useFormHandlers} from "../../hooks/useFormHandlers";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
}

const registerFormFields: Field[] = [
  {name: 'name', label: 'user_name', inputType: 'input', type: 'text', placeholder: 'Username'},
  {name: 'email', label: 'user_email', inputType: 'input', type: 'email', placeholder: 'User email'},
  {name: 'password', label: 'user_password', inputType: 'input', type: 'password', placeholder: 'password'},
  {
    name: 'confirm_password',
    label: 'confirm_password',
    inputType: 'input',
    type: 'password',
    placeholder: 'confirm password'
  },
]
const RegisterFormWrapper = () => {
  const [registration, {isLoading, error, data}] = useRegistrationMutation()
  const onSubmit = async (body: RegisterFormValues) => {
    await registration(body).unwrap().catch((error) => error)
  }
  const isSubmit = data && data.success
  const {
    values,
    handleChange,
    handleSubmit,
  } = useFormHandlers<RegisterFormValues>({initialValue: initialValues, onSubmit, onDone: isSubmit})
  const errors: ValidationError[] | undefined = parseErrors(error)
  return (
    <div className="text-center mt-4">
      <h1>Register Page</h1>
      <Row>
        <Col className="bg-body-secondary p-5" sm={{offset: 3, span: 6}}>
          <BaseForm
            <RegisterFormValues>
            loading={isLoading}
            errors={errors}
            values={values}
            onChange={handleChange}
            fields={registerFormFields}
            onSubmit={handleSubmit}
            buttonSubmitTitle="register"
          />
        </Col>
      </Row>
    </div>
  )
}

export default RegisterFormWrapper;