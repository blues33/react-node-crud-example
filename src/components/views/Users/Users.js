import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import _ from 'lodash';

import ConfirmModal from '../../common/ConfirmModal';
import { getUsers, deleteUser } from '../../../actions/user';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      delUser: null,
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  onAdd = () => {
    this.props.history.push('/add-user');
  };

  onEdit = (user) => {
    this.props.history.push(`/edit-user/${user._id}`);
  };

  onDelete = (user) => {
    this.setState({
      isModalOpen: true,
      delUser: user,
    })
  }

  toggleConfirmModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  onConfirmDelete = () => {
    this.setState({
      isModalOpen: false
    })
    this.props.deleteUser(this.state.delUser._id);
  }

  onCancelDelete = () => {
    this.setState({
      isModalOpen: false
    })
  }

  render() {
    const { user, users } = this.props;
    return (
      <div className="animated fadeIn h-100 w-100">
        <Button color="primary" onClick={this.onAdd} className="m-b-20">
          Add
        </Button>
        {users.length > 0 ?
        <Table bordered>
          <thead>
            <tr>
              <th className="align-center">#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="cursor-pointer">
                <td scope="row" className="align-center">{index + 1}</td>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{_.startCase(_.toLower(user.role))}</td>
                <td className="align-center">
                  <Button
                    color="warning"
                    onClick={() => this.onEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => this.onDelete(user)}
                    className="m-l-20"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        : <div className="align-center"><h4>No users found</h4></div>
        }

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
  ({ users, authentication, }) => ({
    ...users,
    ...authentication,
  }),
  dispatch => ({
    getUsers: () => dispatch(getUsers()),
    deleteUser: (id) => dispatch(deleteUser(id)),
  }),
)(Users);
