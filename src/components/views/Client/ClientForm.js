import * as React from 'react';
import { Button } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import renderInput from "../../common/FormInput";
import { renderSelect } from "../../common/FormSelect";
import { selectClient, addClient, editClient, deleteClient } from '../../../actions/clients';

export class ClientForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      client: {},
      selectedId: -1,
    };
  }

  componentDidMount () {
    const selectedId = this.props.match.params.id;
    if (selectedId >= 0) {
      this.props.selectClient(selectedId);
      this.setState({
        selectedId
      });
    }
  }

  handleCancel = (e) => {
    this.props.history.push('/clients');
  };

  removeClient = (e) => {
    let message = 'Are you sure to delete this client?';
    confirmAlert({
      title: '',
      message: message,
      buttons: [
        {
          label: 'Yes',
          onClick: () => { this.removeUser(); }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  removeUser = () => {
    this.props.deleteClient(this.state.selectedId);
    this.props.history.push('/clients');
  };

  render() {
    return (
      <div className="animated fadeIn h-100 w-100">
        <h2>Workday Web Service</h2>
        <Field
          name="clientName"
          label="Client Name"
          component={renderInput}
        />
        <Field
          name="reportURL"
          label="Workday Report URL:"
          placeholder="e.g: hppts://wd2-impl-services1.workday.com/ccx/service/customreport"
          component={renderInput}
        />
        <Field
          name="webServiceVersion"
          label="Select Web Service Version:"
          component={renderSelect}
          options={[{value: 28.1, label: 28.1}]}
        />
        <Field
          name="username"
          type="text"
          label="User Name"
          placeholder="User Name"
          component={renderInput}
        />
        <Field
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          component={renderInput}
        />
        <div className="d-flex justify-content-between align-items-center">
          <Button color="primary" onClick={this.props.handleSubmit}>Save</Button>
          {
            this.state.selectedId >= 0 &&
            <Button color="danger" onClick={this.removeClient} className="m-l-20">Delete</Button>
          }
          <Button onClick={this.handleCancel} className="m-l-20">Cancel</Button>
        </div>
      </div>
    );
  }
}

const ClientReduxForm = reduxForm({
  form: "ClientForm",
  onSubmit: (values, dispatch, props) => {
    if (!!props.match.params.id) {
      props.editClient(props.match.params.id, values);
    } else {
      props.addClient(values);
    }
    props.history.push('/clients');
  }
})(ClientForm);

export default connect(
  ({ authentication, clients }) => ({
    ...authentication,
    initialValues: clients.selectedClient
  }),
  dispatch => ({
    addClient: (values) => dispatch(addClient(values)),
    editClient: (id, values) => dispatch(editClient(id, values)),
    deleteClient: (id) => dispatch(deleteClient(id)),
    selectClient: (id) => dispatch(selectClient(id)),
  })
)(ClientReduxForm);
