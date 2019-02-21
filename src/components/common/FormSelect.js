import React from 'react';
import {
  FormGroup, Label, FormFeedback, Input,
} from 'reactstrap';
import classnames from 'classnames';

export const renderSelect = ({
  options,
  input,
  label,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        {...input}
        type="select"
        className={error && 'is-invalid'}
      >
        <option value={'---'}>{placeholder || '---'}</option>
        {options.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </Input>
      {error && <FormFeedback className="error"> {error} </FormFeedback>}
    </FormGroup>
  );
};
