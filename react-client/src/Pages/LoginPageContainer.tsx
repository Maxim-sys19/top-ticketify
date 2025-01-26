import React, {useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {Field} from "../Components/Form/FormFieldTypes";
import LoginForm from '../Components/Form/BaseForm'
import {useLoginMutation} from "../redux/api/auth/login.service";
import {parseErrors, ValidationError} from "../helpers/parseErrors";
import {Col, Row} from "react-bootstrap";

interface LoginFormValues {
  email: string,
  password: string,
}

const initialValues: LoginFormValues = {
  email: '',
  password: '',
}
const loginFormFields: Field[] = [
  {name: 'email', label: 'email', inputType: 'input', type: 'email', placeholder: 'Email'},
  {name: 'password', label: 'password', inputType: 'input', type: 'password', placeholder: 'Password'},
]

const LoginPageContainer = () => {
  const navigate = useNavigate();
  const [login, {isLoading, error, data}] = useLoginMutation()
  const errors: ValidationError[] | undefined = parseErrors(error)
  const isToken = data && data
  const handleSubmit = async (body: LoginFormValues) => {
    await login(body).unwrap().then(() => {
      navigate('/profile')
    }).catch((error) => error)
  }
  return (
    <div className="text-center mt-4">
      <h1>Login Page</h1>
      <Row>
        <Col className="bg-body-secondary p-5" sm={{offset: 3, span: 6}}>
          <LoginForm
            <LoginFormValues>
            done={isToken}
            fields={loginFormFields}
            errors={errors}
            onSubmit={handleSubmit}
            loading={isLoading}
            initialValue={initialValues}
            buttonSubmitTitle="login"
          />
          <Col>
            <NavLink to="/forgot-password">forgot password</NavLink>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginPageContainer;