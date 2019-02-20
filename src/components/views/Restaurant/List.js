import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';
import StarRatings from 'react-star-ratings';

import ConfirmModal from '../../common/ConfirmModal';
import { getRestaurantsList, deleteRestaurant } from '../../../actions/restaurants';
import { getUsers } from '../../../actions/user';

class Restaurants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      delRestaurant: null,
    };
  }

  componentDidMount() {
    this.props.getRestaurantsList();
    if (this.props.user.role === 'admin') {
      this.props.getUsers();
    }
  }

  onAdd = () => {
    this.props.history.push('/add-restaurant');
  };

  onEdit = (restaurant) => {
    this.props.history.push(`/edit-restaurant/${restaurant._id}`);
  };

  viewRestaurant = (restaurant) => {
    this.props.history.push(`/restaurant/${restaurant._id}`);
  }

  onDelete = (restaurant) => {
    this.setState({
      isModalOpen: true,
      delRestaurant: restaurant,
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
    this.props.deleteRestaurant(this.state.delRestaurant._id);
  }

  onCancelDelete = () => {
    this.setState({
      isModalOpen: false
    })
  }

  render() {
    const { user, restaurants } = this.props;
    return (
      <div className="animated fadeIn h-100 w-100">
        { ['admin', 'owner'].indexOf(user.role) >= 0 && 
          <Button color="primary" onClick={this.onAdd} className="m-b-20">
            Add
          </Button>
        }
        <Table bordered>
          <thead>
            <tr>
              <th className="align-center">#</th>
              <th>Name</th>
              <th>Owner</th>
              <th>Average rating</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr key={index} className="cursor-pointer">
                <td scope="row" className="align-center">{index + 1}</td>
                <td>{restaurant.name}</td>
                <td>{restaurant.owner.fullname}</td>
                <td>
                  {restaurant.rateAvg > 0 ?
                  <StarRatings
                    rating={restaurant.rateAvg}
                    starRatedColor="rgb(230, 67, 47)"
                    starDimension="20px"
                    starSpacing="0px"
                  />
                  : <i>No review</i>
                  }
                </td>
                <td className="align-center">
                  <Button
                    color="primary"
                    onClick={() => this.viewRestaurant(restaurant)}
                  >
                    View
                  </Button>
                  {user.role !== 'regular' && 
                  <>
                  <Button
                    color="warning"
                    className="m-l-20"
                    onClick={() => this.onEdit(restaurant)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => this.onDelete(restaurant)}
                    className="m-l-20"
                  >
                    Delete
                  </Button>
                  </>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ConfirmModal
          isOpen={this.state.isModalOpen}
          type="danger"
          confirmText="Delete"
          title="Confirmation"
          text="Are you sure you want to delete the restaurant?"
          toggleModal={this.toggleConfirmModal}
          onConfirm={this.onConfirmDelete}
          onCancel={this.onCancelDelete}
        />
      </div>
    );
  }
}

export default connect(
  ({ restaurants, authentication, }) => ({
    ...restaurants,
    ...authentication,
  }),
  dispatch => ({
    getUsers: () => dispatch(getUsers()),
    getRestaurantsList: () => dispatch(getRestaurantsList()),
    deleteRestaurant: (id) => dispatch(deleteRestaurant(id)),
  }),
)(Restaurants);
