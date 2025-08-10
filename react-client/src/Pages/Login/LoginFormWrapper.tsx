import React from 'react';
import BaseForm from "../../Components/Form/BaseForm";
import {Field} from "../../Components/Form/FormFieldTypes";
import {useNavigate} from "react-router-dom";
import {useLoginMutation} from "../../redux/api/auth/login.service";
import {parseErrors, ValidationError} from "../../helpers/parseErrors";
import {useFormHandlers} from "../../hooks/useFormHandlers";

export interface LoginFormValues {
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
function LoginFormWrapper(){
   const navigate = useNavigate();
    const [login, {isLoading, error, data}] = useLoginMutation()
    const errors: ValidationError[] | undefined = parseErrors(error)
    const isToken = data && data
    const onSubmit = async (body: LoginFormValues) => {
      await login(body).unwrap().then(() => {
        navigate('/profile')
      }).catch((error) => error)
    }
    const {handleChange, handleSubmit, values} = useFormHandlers<LoginFormValues>({initialValue: initialValues, onSubmit})
  return (
    <BaseForm fields={loginFormFields} values={values} onChange={handleChange} onSubmit={handleSubmit} loading={isLoading} errors={errors} buttonSubmitTitle="login"/>
  )
}

export default LoginFormWrapper;