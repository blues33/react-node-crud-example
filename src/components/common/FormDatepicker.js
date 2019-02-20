import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import classnames from 'classnames';
import DatePicker from "react-datepicker";

const renderDatePicker = ({
  input,
  label,
  maxDate,
  meta: { touched, error },
}) => {
  return (
    <FormGroup className="custom-form-group">
      <Label>{label}</Label>
      <div className="m-b-10">
        <DatePicker
          selected={Date.parse(input.value)}
          onChange={value => input.onChange(value)}
          maxDate={maxDate}
          className="form-control"
        />
      </div>
      {touched && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

renderDatePicker.propTypes = {
  maxDate: PropTypes.instanceOf(Date).isRequired
};

export default renderDatePicker;
