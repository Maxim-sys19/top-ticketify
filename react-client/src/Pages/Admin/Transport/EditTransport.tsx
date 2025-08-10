import React, {memo, useMemo} from 'react';
import EditTransportModal from '../../../Components/Modal/BaseModal'
import EditTransportForm from '../../../Components/Form/BaseForm'
import {Field} from "../../../Components/Form/FormFieldTypes";
import {useUpdateTransportMutation} from '../../../redux/api/admin/transport/transport.api.service';
import {parseErrors} from '../../../helpers/parseErrors';
import {IEditEntityProps} from '../../../interfaces/create-entitie-interfaces';
import {useFormHandlers} from "../../../hooks/useFormHandlers";

interface EditTransportFormValues {
  transport_name: string
  transport_description: string
  capacity: number
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
]

function EditTransport<T extends Record<string, any>>({entity, show, onClose}: IEditEntityProps<T>) {
  const [updateTransport, {isLoading, error}] = useUpdateTransportMutation()
  const errors = parseErrors(error)
  const initialValues = useMemo(() => {
    return {
      transport_name: entity?.name,
      transport_description: entity?.description,
      capacity: entity?.capacity,
    }
  }, [entity?.capacity, entity?.description, entity?.name])
  const onSubmit = async (body: EditTransportFormValues) => {
    await updateTransport({id: entity?.id, body})
    console.log(body)
  }
  const {values, handleChange, handleSubmit} = useFormHandlers<EditTransportFormValues>({
    initialValue: initialValues,
    onSubmit
  })
  return (
    <EditTransportModal backdrop="static" title="Edit transport" show={show} onHide={onClose}>
      <EditTransportForm<EditTransportFormValues>
        values={values}
        errors={errors}
        loading={isLoading}
        buttonSubmitTitle="update transport"
        fields={editTransportFormFields}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </EditTransportModal>
  );
}

export default memo(EditTransport) as <T extends Record<string, any>>(props: IEditEntityProps<T>) => JSX.Element;