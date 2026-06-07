import React, {useMemo} from 'react';
import {useGetCompaniesQuery} from "../../../redux/api/admin/company/company.api.service";
import {useCreateTransportMutation} from "../../../redux/api/admin/transport/transport.api.service";
import {parseErrors} from "../../../helpers/parseErrors";
import TransportForm from "../../../Components/Form/BaseForm";
import {Field} from "../../../Components/Form/FormFieldTypes";
import {Button} from "react-bootstrap";
import useOpenModal from "../../../hooks/useOpenModal";
import CreateTransportModal from '../../../Components/Modal/BaseModal'
import {useFormHandlers} from "../../../hooks/useFormHandlers";

interface TransportInputTypes {
  transport_name: string
  transport_description: string
  capacity: number
  company_name: string
}

const initialValues: TransportInputTypes = {
  transport_name: '',
  transport_description: '',
  capacity: 0,
  company_name: ''
}
export const transportFields: Field[] = [
  {name: 'transport_name', type: "text", inputType: 'input', placeholder: 'transport name', label: 'name of transport'},
  {
    name: 'transport_description',
    type: "textarea",
    inputType: 'textarea',
    placeholder: 'transport description',
    label: 'description of transport'
  },
  {
    name: 'capacity',
    type: "number",
    inputType: 'input',
    placeholder: 'number of capacity',
    label: 'capacity of the transport'
  },
  {name: 'company_name', type: "select", inputType: 'select', placeholder: 'companies', label: 'select company'},
]

function CreateTransport() {
  const {data} = useGetCompaniesQuery({})
  const {show, close, open} = useOpenModal()
  const [createTransport, {isLoading, error, data: success}] = useCreateTransportMutation()
  const onSubmit = async (body: TransportInputTypes) => {
      const data = {
        transport_name: body.transport_name,
        transport_description: body.transport_description,
        capacity: Number(body.capacity),
        company_name: body.company_name
      }
      await createTransport(data).unwrap()
        .then((res) => {
          if (res) {
            close()
          }
        })
        .catch(() => {
          open('create')
        })
    }
  const done = success && success === true
const {values, handleSubmit, handleChange} = useFormHandlers<TransportInputTypes>({initialValue: initialValues, onSubmit, onDone: done})
  const companies = useMemo(() => {
    return data?.data.map((company: any) => company.name)
  }, [data])
  const errors = parseErrors(error)
  return (
    <div>
      <Button onClick={() => open('create')}>+</Button>
      <CreateTransportModal show={show === 'create'} title="Create transport" onHide={() => close()} backdrop="static">
        <TransportForm<TransportInputTypes>
          onSubmit={handleSubmit}
          onChange={handleChange}
          selectValues={companies}
          errors={errors}
          loading={isLoading}
          buttonSubmitTitle="create transport"
          fields={transportFields}
          values={values}
        />
      </CreateTransportModal>
    </div>
  );
}

export default CreateTransport;