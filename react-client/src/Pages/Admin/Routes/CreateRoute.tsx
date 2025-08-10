import React, {useCallback, useMemo} from 'react';
import {Button} from 'react-bootstrap';
import {Field} from "../../../Components/Form/FormFieldTypes";
import CreateRouteModal from "../../../Components/Modal/BaseModal"
import useOpenModal from "../../../hooks/useOpenModal";
import {useCreateRouteMutation} from "../../../redux/api/admin/routes/routes.api.service";
import {parseErrors} from "../../../helpers/parseErrors";
import {RoutesInputTypes} from '../../../interfaces/routes/route-handles-interface';
import RouteFormWrapper from "./RouteFormWrapper";

export const routesFields: Field[] = [
  {name: 'routeName', type: 'text', inputType: 'input', label: 'route name', placeholder: 'create route name'},
  // {name: 'start', type: 'text', inputType: 'input', label: 'from', placeholder: 'start place'},
  // {name: 'end', type: 'text', inputType: 'input', label: 'to', placeholder: 'end place'},
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
  const submitHandler = useCallback(async (value: RoutesInputTypes) => {
    const data = {
      ...value,
      departureTime: value.departureTime?.toISOString(),
      arrivalTime: value.arrivalTime?.toISOString(),
    }
    await createRoute(data)
  }, [createRoute])
  return (
    <div>
      <Button onClick={() => open('create')}>+</Button>
      <CreateRouteModal backdrop="static" title="Create route" show={show === 'create'} onHide={close}>
        <>
          <RouteFormWrapper<RoutesInputTypes>
            done={done}
            errors={errors}
            fields={routesFields}
            loading={isLoading}
            buttonSubmitTitle="create route"
            // initialValue={initialValues}
            onSubmit={submitHandler}
          />
        </>
      </CreateRouteModal>
    </div>
  );
}

export default CreateRoute;