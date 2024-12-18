import React from 'react';
import RegisterForm from "../Components/Form/BaseForm";
import {Field} from "../Components/Form/FormFieldTypes";
import {useRegistrationMutation} from "../redux/api/auth/register.service";
import {parseErrors, ValidationError} from "../helpers/parseErrors";
import {Col, Row} from "react-bootstrap";

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
  {name: 'name', label: 'user_name', type: 'text', placeholder: 'Username'},
  {name: 'email', label: 'user_email', type: 'email', placeholder: 'User email'},
  {name: 'password', label: 'user_password', type: 'password', placeholder: 'password'},
  {name: 'confirm_password', label: 'confirm_password', type: 'password', placeholder: 'confirm password'},
]
const RegisterPageContainer = () => {
  const [registration, {isLoading, error, data}] = useRegistrationMutation()
  const errors: ValidationError[] | undefined = parseErrors(error)
  const isSubmit = data && data.success
  const handleSubmit = async (body: RegisterFormValues) => {
    await registration(body).unwrap().catch((error) => error)
  }
  return (
    <div className="text-center mt-4">
      <h1>Register Page</h1>
      <Row>
        <Col className="bg-body-secondary p-5" sm={{offset: 3, span: 6}}>
          <RegisterForm
            <RegisterFormValues>
            done={isSubmit}
            loading={isLoading}
            errors={errors}
            fields={registerFormFields}
            initialValue={initialValues}
            onSubmit={handleSubmit}
            buttonSubmitTitle="register"
          />
        </Col>
      </Row>
    </div>
  )
}

export default RegisterPageContainer;