import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import renderInput from '../../common/FormInput';
import { renderSelect } from '../../common/FormSelect';
import { updateRestaurant } from '../../../actions/restaurants';
import { restaurantFormValidate } from '../../../utils/validate';

export class EditRestaurantForm extends React.Component {
  handleCancel = e => {
    this.props.history.push('/restaurants');
  };

  render() {
    if (this.props.user.role === 'admin' && this.props.users.length === 0) {
      return null;
    }
    const options = this.props.users
      .filter((user) => user.role === 'owner')
      .map((user) => ({
        label: user.fullname,
        value: user._id
      }));
    return (
      <div className="animated fadeIn h-100 w-100">
        <h2>Edit restaurant</h2>
        { this.props.user.role === 'admin' && 
        <Field
          name="owner"
          label="Owner"
          options={options}
          component={renderSelect}
        />
        }
        <Field
          name="name"
          type="text"
          label="Name"
          component={renderInput}
        />
        <div className="d-flex justify-content-between align-items-center">
          <Button color="primary" onClick={this.props.handleSubmit}>
            Update
          </Button>
          <Button onClick={this.handleCancel} className="m-l-20">
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

const ReduxForm = reduxForm({
  form: 'EditRestaurantForm',
  onSubmit: (values, dispatch, props) => {
    const selectedRestaurant = props.restaurants.find((item) => item._id === props.match.params.id)
    if (!selectedRestaurant) return;
    const updatedValues = {
      ...values,
      id: selectedRestaurant._id,
    };
    props.updateRestaurant(updatedValues);
  },
  validate: restaurantFormValidate,
})(EditRestaurantForm);

export default connect(
  ({ authentication, restaurants, users }, props) => {
    const selectedRestaurant = restaurants.restaurants.find((item) => item._id === props.match.params.id)
    let initialValues = {}
    if (selectedRestaurant) {
      initialValues = {
        name: selectedRestaurant.name,
        owner: selectedRestaurant.owner._id,
      }
    }
    return {
      ...authentication,
      ...restaurants,
      ...users,
      initialValues,
    }
  },
  dispatch => ({
    updateRestaurant: (values) => dispatch(updateRestaurant(values)),
  }),
)(ReduxForm);
