import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import ConfirmModal from '../../common/ConfirmModal';
import { getUsers, deleteUser } from '../../../actions/user';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      delUser: null,
      page: 1,
      pageSize: 0,
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  onAdd = () => {
    this.props.history.push('/user/new');
  };

  onEdit = (user) => {
    this.props.history.push(`/user/edit/${user._id}`);
  };

  onDelete = (user) => {
    this.setState({
      isModalOpen: true,
      delUser: user,
    });
  }

  toggleConfirmModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  onConfirmDelete = () => {
    this.setState({
      isModalOpen: false,
    });
    this.props.deleteUser(this.state.delUser._id);
  }

  onCancelDelete = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  render() {
    const { users } = this.props;
    const { page, pageSize } = this.state;
    const columns = [{
      dataField: '_id',
      text: '#',
      formatter: (cell, row, rowIndex) => (page - 1) * pageSize + rowIndex + 1,
      classes: 'column-number',
      headerClasses: 'column-number',
    },
    {
      dataField: 'fullname',
      text: 'Name',
      sort: true,
    }, {
      dataField: 'email',
      text: 'Email',
      sort: true,
    }, {
      dataField: 'role',
      text: 'Role',
      sort: true,
    }, {
      dataField: '',
      text: 'Actions',
      formatter: (cell, row, rowIndex) => (
        <>
        <Button color="warning" onClick={() => this.onEdit(row)}>
          Edit
        </Button>
        <Button color="danger" onClick={() => this.onDelete(row)} className="m-l-20">
          Delete
        </Button>
        </>
      ),
      classes: 'align-center',
      headerClasses: 'align-center',
    }];
    const defaultSorted = [{
      dataField: 'fullname',
      order: 'desc',
    }];
    const options = {
      onSizePerPageChange: (sizePerPage, page) => {
        console.log('size change: ', sizePerPage, page);
        this.setState({
          pageSize: sizePerPage,
          page,
        });
      },
      onPageChange: (page, sizePerPage) => {
        console.log('page change: ', sizePerPage, page);
        this.setState({
          pageSize: sizePerPage,
          page,
        });
      },
    };
    return (
      <div className="animated fadeIn h-100 w-100">
        <Button color="primary" onClick={this.onAdd} className="m-b-20">
          Add
        </Button>
        <BootstrapTable
          bootstrap4
          keyField='_id'
          data={users}
          columns={columns}
          defaultSorted={defaultSorted}
          pagination={ paginationFactory(options) }
          noDataIndication="No user found"
          striped
          hover
        />
        <ConfirmModal
          isOpen={this.state.isModalOpen}
          type="danger"
          confirmText="Delete"
          title="Confirmation"
          text="Are you sure you want to delete the user?"
          toggleModal={this.toggleConfirmModal}
          onConfirm={this.onConfirmDelete}
          onCancel={this.onCancelDelete}
        />
      </div>
    );
  }
}

export default connect(
  ({ users, authentication }) => ({
    ...users,
    ...authentication,
  }),
  dispatch => ({
    getUsers: () => dispatch(getUsers()),
    deleteUser: id => dispatch(deleteUser(id)),
  }),
)(Users);
