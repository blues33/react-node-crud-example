import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import renderInput from '../../common/FormInput';
import { renderSelect } from '../../common/FormSelect';
import { updateRestaurant, getRestaurantInfo } from '../../../actions/restaurants';
import { getUsers } from '../../../actions/user';
import { restaurantFormValidate } from '../../../utils/validate';

export class EditRestaurantForm extends React.Component {
  componentDidMount() {
    this.props.getUsers();
    this.props.getRestaurant(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.initialValues, nextProps.initialValues)) {
      this.props.change('name', nextProps.initialValues.name);
      this.props.change('owner', nextProps.initialValues.owner);
    }
  }

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
        <Breadcrumb>
          <BreadcrumbItem><Link to="/restaurants">Restaurants</Link></BreadcrumbItem>
          <BreadcrumbItem active>{this.props.initialValues.name}</BreadcrumbItem>
        </Breadcrumb>
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
    if (!props.currentRestaurant) return;
    const updatedValues = {
      ...values,
      id: props.currentRestaurant._id,
    };
    props.updateRestaurant(updatedValues);
  },
  validate: restaurantFormValidate,
})(EditRestaurantForm);

export default connect(
  ({ authentication, restaurants, users }, props) => {
    let initialValues = {};
    if (restaurants.currentRestaurant) {
      initialValues = {
        name: restaurants.currentRestaurant.name,
        owner: restaurants.currentRestaurant.owner._id,
      }
    }
    console.log('initial value: ', initialValues)
    return {
      ...authentication,
      ...restaurants,
      ...users,
      initialValues,
    }
  },
  dispatch => ({
    getUsers: () => dispatch(getUsers()),
    getRestaurant: (id) => dispatch(getRestaurantInfo(id)),
    updateRestaurant: (values) => dispatch(updateRestaurant(values)),
  }),
)(ReduxForm);
