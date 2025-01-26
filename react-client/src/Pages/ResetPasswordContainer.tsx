import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {useSearchParams} from 'react-router-dom'
import ResetPasswordForm from '../Components/Form/BaseForm'
import {Field} from "../Components/Form/FormFieldTypes";
import {useResetPasswordMutation} from "../redux/api/auth/forgot.password.service";
import {parseErrors, ValidationError} from "../helpers/parseErrors";

interface ResetPasswordFormValues {
  reset_token: string | null;
  old_password: string;
  new_password: string;
}

const resetPasswordFormFields: Field[] = [
  {name: 'reset_token', type: 'text', inputType: 'input', label: 'reset token', placeholder: 'Reset token'},
  {name: 'old_password', type: 'password', inputType: 'input', label: 'old password', placeholder: 'Old password'},
  {name: 'new_password', type: 'password', inputType: 'input', label: 'new password', placeholder: 'new password'},
]
const ResetPasswordContainer = () => {
  const [searchParams] = useSearchParams();
  const resetToken: string | null = searchParams.get('token')
  const initialValues: ResetPasswordFormValues = {
    reset_token: resetToken,
    old_password: '',
    new_password: '',
  }
  const [resetPassword, {error, isLoading, data}] = useResetPasswordMutation()
  const errors: ValidationError[] | undefined = parseErrors(error)
  const isDone = data && data.success
  const handleSubmit = async (body: ResetPasswordFormValues) => {
    await resetPassword(body).unwrap().catch(error => error)
  }
  return (
    <Container fluid={true} className="text-center mt-5">
      <h1>Reset password</h1>
      <Row>
        <Col className="bg-body-secondary p-5" sm={{offset: 3, span: 6}}>
          <ResetPasswordForm
            <ResetPasswordFormValues>
            buttonSubmitTitle="reset password"
            onSubmit={handleSubmit}
            fields={resetPasswordFormFields}
            initialValue={initialValues}
            done={isDone}
            errors={errors}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ResetPasswordContainer;