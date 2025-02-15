import React from 'react';
import RoutesForm from '../../../Components/Form/BaseForm'
import {Field} from '../../../Components/Form/FormFieldTypes';

interface RoutesInputTypes {
  start: string;
  end: string;
  departureTime: Date | null;
  arrivalTime: Date | null;
}

const initialValues: RoutesInputTypes = {
  start: '',
  end: '',
  departureTime: new Date(),
  arrivalTime: new Date(),
}
const routesFields: Field[] = [
  {name: 'start', type: 'text', inputType: 'input', label: 'from', placeholder: 'start place'},
  {name: 'end', type: 'text', inputType: 'input', label: 'to', placeholder: 'end place'},
  {name: 'departureTime', type: 'datetime-local', inputType: 'datetime-local', label: 'departure time', placeholder: 'departure time'},
  {name: 'arrivalTime', type: 'datetime-local', inputType: 'datetime-local', label: 'arrival time', placeholder: 'arrival time'}
]
const RoutesPage = () => {
  const submitHandler = (body: RoutesInputTypes) => {
    const data = {
      ...body,
      departureTime: body.departureTime?.toISOString(),
      arrivalTime: body.arrivalTime?.toISOString(),
    }
    console.log('submited routes', data);
  }
  return (
    <>
      <h1>Routes</h1>
      <RoutesForm<RoutesInputTypes>
        fields={routesFields}
        loading={false}
        buttonSubmitTitle="create route"
        initialValue={initialValues}
        onSubmit={submitHandler}
      />
    </>
  )
}

export default RoutesPage;