import React from "react";
import { Form } from "semantic-ui-react";

export const FormFieldHelper = (props) => {
  const fieldClass = `${props.baseClass}-field`;
  const labelClass = `${props.baseClass}-label`;
  const id = `${props.idPrefix}-${props.name.replace(" ", "-")}`;
  const type = props.type ? props.type : "text";
  const placeholder = props.placeholder ? props.placeholder : props.name;
  const initialValue = props.initialValue ? props.initialValue : null;

  return (
    <Form.Field className={fieldClass}>
      <label className={labelClass} htmlFor={id}>
        {props.name}
      </label>
      <input
        placeholder={placeholder}
        id={id}
        onChange={props.onChange}
        type={type}
        value={initialValue}
      />
    </Form.Field>
  );
};

export const isSameDay = (first, second) => (
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()
)
