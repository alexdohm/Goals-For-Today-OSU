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

export const isSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const dateToTimestampString = (date) => {
  const month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  const year = date.getFullYear();
  let hour = date.getHours();
  let ampm = "am";
  if (hour == 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
    ampm = "pm";
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return month + "/" + day + "/" + year + " @ " + hour + ":" + minutes + ampm;
};
