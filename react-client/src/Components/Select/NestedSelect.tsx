import React, {memo} from 'react';
import {BaseSelectProps} from "./Select";
import {Field} from "../Form/FormFieldTypes";
import {Form} from "react-bootstrap";
import {findChildArray, getValueAtPath} from "./utils/nestedSelectHelpers";


interface SelectTreeProps extends BaseSelectProps {

}

const NestedSelect: React.FC<SelectTreeProps> = (props: SelectTreeProps) => {
  const {onChange, field, selectValues, value} = props
  const rootValue = {
    company: value
  }
  const handleChange = (name: string, newValue: any) => {
    onChange?.({target: {name, value: newValue}});
  };
  const renderSelect = (field: Field, items: any[] | undefined) => {
    const currentValue = getValueAtPath(field.name, rootValue)
    if (!items || items.length === 0) return null
    return (
      <div key={field.name} className="mb-2">
        <Form.Select
          name={field.name}
          className="m-2"
          value={
            field.type === 'option' && Array.isArray(currentValue)
              ? currentValue.map(String)
              : String(currentValue ?? '')
          }
          multiple={field.type === 'option'}
          onChange={(e) => {
            let newValue: string | string[];
            if (e.target.multiple) {
              newValue = Array.from(e.target.selectedOptions, (opt) => opt.value);
            } else {
              newValue = e.target.value;
            }
            handleChange(field.name, newValue);
          }}
        >
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {items.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name || item.title || `#${item.id}`}
            </option>
          ))}
        </Form.Select>
        {
          field.children?.map((child) => {
            const selected =
              Array.isArray(currentValue)
                ? items.filter((item) => currentValue.includes(String(item.id)))
                : items.find((item) => String(item.id) === String(currentValue));
            const nextValues = findChildArray(selected, child);
            return renderSelect(child, nextValues)
          })
        }
      </div>
    )
  }
  return (
    <>
      {renderSelect(field, selectValues)}
    </>
  );
}

export default memo(NestedSelect);