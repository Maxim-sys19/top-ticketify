import React from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker'
interface DateTimePickerProps {
  label: string
  selectedDate: Date | null
  onChange: (date: Date | null) => void
}
const DateTimePicker = ({label, onChange, selectedDate}: DateTimePickerProps) => {
  return (
    <Form.Group className="mt-3">
      <Form.Label>{label}</Form.Label>
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        className="form-control"
      />
    </Form.Group>
  )
}

export default DateTimePicker;