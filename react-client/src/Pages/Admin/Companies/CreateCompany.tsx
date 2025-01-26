import React, {memo, useCallback, useState} from 'react';
import {Field} from "../../../Components/Form/FormFieldTypes";
import {useCreateCompanyMutation} from "../../../redux/api/admin/company/company.api.service";
import {parseErrors} from "../../../helpers/parseErrors";
import CompanyForm from "../../../Components/Form/BaseForm";
import CompanyModal from '../../../Components/Modal/BaseModal'
import {Button} from "react-bootstrap";
import useOpenModal from "../../../hooks/useOpenModal";

interface CompanyFormValues {
  name: string
  email: string
  password: string | number
  role_name: string
  company_name: string
  company_description: string
}

const companyFormFields: Field[] = [
  {name: 'name', type: 'text', inputType: 'input', label: 'name', placeholder: 'name'},
  {name: 'email', type: 'email', inputType: 'input', label: 'email', placeholder: 'email'},
  {name: 'password', type: 'password', inputType: 'input', label: 'password', placeholder: 'password'},
  {name: 'role_name', type: 'select', label: 'select user role', placeholder: 'role'},
  {name: 'company_name', type: 'text', inputType: 'input', label: 'name of company', placeholder: 'company name'},
  {name: 'company_description', type: 'text', inputType: 'textarea', label: 'description of company', placeholder: 'company description'},
]

const initialValues: CompanyFormValues = {
  name: '',
  email: '',
  password: '',
  role_name: '',
  company_name: '',
  company_description: '',
}

const selectValues = ['user', 'company_user', 'admin_user']

function CreateCompany() {
  const [createCompany, {isLoading, error, data}] = useCreateCompanyMutation()
  const {show, close, open} = useOpenModal()
  const errors = parseErrors(error)
  const isSuccess = data && data === 'active'
  const handleSubmit = async (data: CompanyFormValues) => {
    let companyBody = {
      name: data.name,
      email: data.email,
      password: data.password,
      roles: {
        role_name: data.role_name
      },
      company: {
        company_name: data.company_name,
        company_description: data.company_description,
      }
    }
    await createCompany(companyBody).unwrap().then((res) => {
      close()
    }).catch(err => {
      if(err) {
        open('create')
      }
    })
  }

  return (
    <>
      <Button onClick={() => open('create')}>+</Button>
      <CompanyModal
        title="Create Company"
        show={show === 'create'}
        backdrop="static"
        onHide={close}
      >
        <CompanyForm<CompanyFormValues>
          selectValues={selectValues}
          done={isSuccess}
          buttonSubmitTitle="create company"
          loading={isLoading}
          errors={errors}
          fields={companyFormFields}
          initialValue={initialValues}
          onSubmit={handleSubmit}
        />
      </CompanyModal>
    </>
  );
}

export default memo(CreateCompany);