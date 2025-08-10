import React, {useEffect} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import ForgotPasswordForm from '../../Components/Form/BaseForm'
import {useForgotPasswordMutation} from "../../redux/api/auth/forgot.password.service";
import {Field} from "../../Components/Form/FormFieldTypes";
import {parseErrors, ValidationError} from "../../helpers/parseErrors";
import {useFormHandlers} from "../../hooks/useFormHandlers";

interface ForgotPasswordFormValues {
  email: string;
}

const initialValues: ForgotPasswordFormValues = {
  email: "",
}
const forgotPasswordFormFields: Field[] = [
  {name: 'email', label: 'email', inputType: 'input', type: 'email', placeholder: 'Email'},
]
const ForgotPasswordContainer = () => {
  const [forgotPassword, {error, isLoading, data}] = useForgotPasswordMutation()
  const isDone = data && data.success
  const onSubmit = async (body: ForgotPasswordFormValues) => {
      await forgotPassword(body).unwrap().catch(error => error)
    }
  const {values, handleChange, handleSubmit} = useFormHandlers<ForgotPasswordFormValues>({initialValue: initialValues, onSubmit, onDone: isDone})
  const errors: ValidationError[] | undefined = parseErrors(error)
  return (
    <Container className="text-center mt-5">
      <h1>Forgot password</h1>
      <Row>
        <Col className="bg-body-secondary p-5" sm={{offset: 3, span: 6}}>
          <ForgotPasswordForm
            <ForgotPasswordFormValues>
            fields={forgotPasswordFormFields}
            loading={isLoading}
            errors={errors}
            values={values}
            onSubmit={handleSubmit}
            onChange={handleChange}
            buttonSubmitTitle="submit"
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ForgotPasswordContainer;