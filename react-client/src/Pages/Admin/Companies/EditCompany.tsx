import React, {memo} from 'react';
import EditCompanyForm from '../../../Components/Form/BaseForm'
import EditCompanyModal from '../../../Components/Modal/BaseModal'
import {Field} from "../../../Components/Form/FormFieldTypes";
import {useUpdateCompanyMutation} from "../../../redux/api/company/company.api.service";
import {parseErrors} from "../../../helpers/parseErrors";

interface EditCompanyFormValues {
  company_name: string
  company_description: string
}

const editCompanyFormFields: Field[] = [
  {name: 'company_name', type: 'text', label: 'edit name', placeholder: 'edit company name'},
  {name: 'company_description', type: 'textarea', label: 'edit description', placeholder: 'edit company description'},
]

function EditCompany({show, onClose, company}: any) {
  const [updateCompany, {isLoading, error}] = useUpdateCompanyMutation()
  const errors = parseErrors(error)
  const initialValues: EditCompanyFormValues = {
    company_name: company.name,
    company_description: company.description
  }
  const handleSubmit = async (data: EditCompanyFormValues) => {
    const companyData = {
      id: company.id,
      body: {
        company_name: data.company_name,
        company_description: data.company_description
      }
    }
    await updateCompany(companyData)
  }
  return (
    <EditCompanyModal title="Edit company" show={show.modalCase === 2 && show.open} backdrop="static" onHide={onClose}>
      <>
        <EditCompanyForm
          buttonSubmitTitle="Update"
          errors={errors}
          loading={isLoading}
          fields={editCompanyFormFields}
          initialValue={initialValues}
          onSubmit={handleSubmit}
        />
      </>
    </EditCompanyModal>
  );
}

export default memo(EditCompany);