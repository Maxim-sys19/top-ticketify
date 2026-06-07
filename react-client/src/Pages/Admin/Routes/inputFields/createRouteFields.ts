import {Field} from "../../../../Components/Form/FormFieldTypes";

export const createRouteFields: Field[] = [
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
  {
    name: 'company.id',
    type: 'optgroup',
    inputType: 'group-select',
    label: 'companies',
    placeholder: 'select company',
    children: [
      {
        name: 'company.transports[0].id',
        type: 'optgroup',
        inputType: 'group-select',
        label: 'transports',
        placeholder: 'select transport',
        children: [
          {
            name: 'company.transports[0].seatIds',
            type: 'option',
            inputType: 'select',
            label: 'seats',
            placeholder: 'select seat',
          }
        ]
      }
    ]
  },
]