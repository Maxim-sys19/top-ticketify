import React from 'react';
import { Button } from 'react-bootstrap';
import {Field} from "../../../Components/Form/FormFieldTypes";
import CreateRouteModal from "../../../Components/Modal/BaseModal"
import RoutesForm from "../../../Components/Form/BaseForm";
import useOpenModal from "../../../hooks/useOpenModal";
import {useCreateRouteMutation} from "../../../redux/api/admin/routes/routes.api.service";
import {parseErrors} from "../../../helpers/parseErrors";
import { RoutesInputTypes } from '../../../interfaces/routes/route-handles-interface';

const initialValues: RoutesInputTypes = {
  start: '',
  end: '',
  departureTime: new Date(),
  arrivalTime: new Date(),
}
export const routesFields: Field[] = [
  {name: 'start', type: 'text', inputType: 'input', label: 'from', placeholder: 'start place'},
  {name: 'end', type: 'text', inputType: 'input', label: 'to', placeholder: 'end place'},
  {
    name: 'departureTime',
    type: 'datetime-local',
    inputType: 'datetime-local',
    label: 'departure time',
    placeholder: 'departure time'
  },
  {
    name: 'arrivalTime',
    type: 'datetime-local',
    inputType: 'datetime-local',
    label: 'arrival time',
    placeholder: 'arrival time'
  }
]
function CreateRoute() {
  const [createRoute, {isLoading, error, data}] = useCreateRouteMutation()
  const errors = parseErrors(error)
  const done = data && data === true
  const {show, close, open} = useOpenModal()
  const submitHandler = async (body: RoutesInputTypes) => {
    const data = {
      ...body,
      departureTime: body.departureTime?.toISOString(),
      arrivalTime: body.arrivalTime?.toISOString(),
    }
    await createRoute(data)
  }
  return (
    <div>
      <Button onClick={() => open('create')}>+</Button>
      <CreateRouteModal title="Create route" show={show === 'create'} onHide={close}>
        <RoutesForm<RoutesInputTypes>
          done={done !== undefined}
          errors={errors}
          fields={routesFields}
          loading={isLoading}
          buttonSubmitTitle="create route"
          initialValue={initialValues}
          onSubmit={submitHandler}
        />
      </CreateRouteModal>
    </div>
  );
}

export default CreateRoute;