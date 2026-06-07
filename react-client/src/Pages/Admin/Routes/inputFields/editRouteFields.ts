import {Field} from "../../../../Components/Form/FormFieldTypes";

export const editRouteFields: Field[] = [
  {name: 'routeName', type: 'text', inputType: 'input', label: 'route name', placeholder: 'create route name'},
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
  },
]