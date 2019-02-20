import * as React from 'react';
import { connect } from "react-redux";
import BootstrapTable from 'react-bootstrap-table-next';
import { Button } from 'reactstrap';

import { selectClient } from '../../../actions/clients';

class Clients extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      columns: []
    };
  }

  onLoadData = (id) => {
    this.props.history.push('/load-data/' + id);
  }

  onAddClient = () => {
    this.props.history.push('/client-form');
  };

  onEditClient(id) {
    this.props.selectClient(id);
    this.props.history.push(`/client-form/${id}`);
  };
  
  render () {
    const clients = this.props.clients || [];
    const columns = [{
      dataField: 'clientName',
      text: 'Client'
    }, {
      dataField: 'reportURL',
      text: 'Workday Report URL'
    }, {
      dataField: 'webServiceVersion',
      text: 'Web Service Version'
    }, {
      dataField: 'username',
      text: 'Username'
    }, {
      dataField: 'password',
      text: 'Password'
    }, {
      dataField: 'id',
      text: '',
      formatter: (cell, row) => (
        <div>
          <Button onClick={() => this.onEditClient(cell)}>Edit Client</Button>
          <Button color="info" className="m-l-10" onClick={() => this.onLoadData(cell)}>Load Data</Button>
        </div>
      )
    }]
    return <div className="animated fadeIn h-100 w-100">
      <Button color="primary" onClick={this.onAddClient} className="m-b-20">Add Client</Button>
      <BootstrapTable keyField="id" data={ clients } columns={ columns } />
    </div>
  }
}

export default connect(
  ({ authentication, clients }) => ({
    ...authentication,
    ...clients
  }),
  dispatch => ({
    selectClient: (id) => dispatch(selectClient(id)),
  })
)(Clients);
