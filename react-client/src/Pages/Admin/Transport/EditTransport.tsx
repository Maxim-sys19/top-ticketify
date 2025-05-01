import React, {memo} from 'react';
import EditTransportModal from '../../../Components/Modal/BaseModal'
import EditTransportForm from '../../../Components/Form/BaseForm'
import {Field} from "../../../Components/Form/FormFieldTypes";
import {useUpdateTransportMutation} from '../../../redux/api/admin/transport/transport.api.service';
import {parseErrors} from '../../../helpers/parseErrors';
import {IEditEntityProps} from '../../../interfaces/create-entitie-interfaces';

interface EditTransportFormValues {
  transport_name: string
  transport_description: string
  capacity: number
  company_name: string
}

const editTransportFormFields: Field[] = [
  {
    name: 'transport_name',
    type: 'text',
    inputType: 'input',
    label: 'Transport name',
    placeholder: 'Edit transport name'
  },
  {
    name: 'transport_description',
    type: 'textarea',
    inputType: 'textarea',
    label: 'Transport description',
    placeholder: 'Edit transport description'
  },
  {name: 'capacity', type: 'number', inputType: 'input', label: 'Transport seats', placeholder: 'Edit transport seats'},
  {name: 'company_name', type: 'text', inputType: 'input', label: 'Company of transport', placeholder: 'Edit company'},
]

function EditTransport<T extends Record<string, any>>({entity, show, onClose}: IEditEntityProps<T>) {
  const [updateTransport, {isLoading, error}] = useUpdateTransportMutation()
  const errors = parseErrors(error)
  const initialValues: EditTransportFormValues = {
    transport_name: entity?.name,
    transport_description: entity?.description,
    capacity: entity?.capacity,
    company_name: entity?.company?.name
  }
  const handleSubmit = async (body: EditTransportFormValues) => {
    await updateTransport({id: entity?.id, body})
  }
  return (
    <EditTransportModal backdrop="static" title="Edit transport" show={show} onHide={onClose}>
      <EditTransportForm<EditTransportFormValues>
        initialValue={initialValues}
        errors={errors}
        loading={isLoading}
        buttonSubmitTitle="update transport"
        fields={editTransportFormFields}
        onSubmit={handleSubmit}
      />
    </EditTransportModal>
  );
}

export default memo(EditTransport) as <T extends Record<string, any>>(props: IEditEntityProps<T>) => JSX.Element;