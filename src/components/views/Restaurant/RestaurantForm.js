import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import renderInput from '../../common/FormInput';
import { renderSelect } from '../../common/FormSelect';
import { getUsers } from '../../../actions/user';
import { addRestaurant } from '../../../actions/restaurants';
import { restaurantFormValidate } from '../../../utils/validate';

export class RestaurantForm extends React.Component {

  componentDidMount() {
    if (this.props.user.role === 'admin') {
      this.props.getUsers();
      this.props.change('owner', '---');
    }
  }

  handleCancel = e => {
    this.props.history.push('/restaurants');
  };

  render() {
    let options = [];
    if (this.props.user.role === 'admin') {
      if (this.props.users.length === 0) {
        return (
          <div className="animated fadeIn h-100 w-100">
            <h3>There are no owner users.</h3>
          </div>
        )
      } else {
        options = this.props.users
        .filter((user) => user.role === 'owner')
        .map((user) => ({
          label: user.fullname,
          value: user._id
        }));
      }
    }
    
    return (
      <div className="animated fadeIn h-100 w-100">
        <Breadcrumb>
          <BreadcrumbItem><Link to="/restaurants">Restaurants</Link></BreadcrumbItem>
          <BreadcrumbItem active>New</BreadcrumbItem>
        </Breadcrumb>
        <h2>Add a new restaurant</h2>
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
            Save
          </Button>
          <Button onClick={this.handleCancel} className="m-l-20">
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

const RestaurantReduxForm = reduxForm({
  form: 'RestaurantForm',
  onSubmit: (values, dispatch, props) => {
    props.addRestaurant({
      ...values,
    });
  },
  validate: restaurantFormValidate,
})(RestaurantForm);

export default connect(
  ({ authentication, restaurants, users }) => ({
    ...authentication,
    ...restaurants,
    ...users,
  }),
  dispatch => ({
    addRestaurant: values => dispatch(addRestaurant(values)),
    getUsers: () => dispatch(getUsers()),
  }),
)(RestaurantReduxForm);
