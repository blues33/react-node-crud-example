import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Table, Input } from 'reactstrap';
import StarRatings from 'react-star-ratings';
import Slider from 'rc-slider';

import ConfirmModal from '../../common/ConfirmModal';
import { getRestaurantsList, deleteRestaurant } from '../../../actions/restaurants';
import { getUsers } from '../../../actions/user';

const operandList = [
  { value: 'gte', label: '>=' },
  { value: 'gt', label: '>' },
  { value: 'eq', label: '=' },
  { value: 'lt', label: '<' },
  { value: 'lte', label: '<=' },
];

class Restaurants extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      delRestaurant: null,
      maxRate: 5,
      minRate: 0,
    };
  }

  componentDidMount() {
    this.props.getRestaurantsList({
      min: this.state.minRate,
      max: this.state.maxRate,
    });
    if (this.props.user.role === 'admin') {
      this.props.getUsers();
    }
  }

  onAdd = () => {
    this.props.history.push('/add-restaurant');
  };

  onFilterValueChange = values => {
    this.setState({
      minRate: values[0],
      maxRate: values[1],
    });
    this.props.getRestaurantsList({
      min: values[0],
      max: values[1],
    });
  }

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
    this.props.deleteRestaurant(this.state.delRestaurant._id, (success) => {
      if (success) {
        this.props.getRestaurantsList({
          operand: this.state.filterOperand,
          filterRate: this.state.filterValue,
        });
      }
    });
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
        <div className="space-between m-b-20 align-middle">
        { ['admin', 'owner'].indexOf(user.role) >= 0 ? 
          <Button color="primary" onClick={this.onAdd}>
            Add
          </Button>
          : <div />
        }
          <div className="filter">
            <div className="filter-label">Filter by rate </div>
            <div className="m-t-5 align-middle">
              <span className="m-r-10 filter-value">{this.state.minRate}</span>
              <Slider.Range
                min={0}
                max={5}
                step={0.5}
                defaultValue={[0, 5]}
                railStyle={{ backgroundColor: 'grey' }}
                trackStyle={[{ backgroundColor: 'red' }, { backgroundColor: 'green' }]}
                onChange={this.onFilterValueChange} />
              <span className="m-l-10 filter-value">{this.state.maxRate}</span>
            </div>
          </div>
        </div>
        {restaurants.length > 0 ?
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
        : <div className="align-center"><h4>No result found</h4></div>
        }

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
    getRestaurantsList: (values) => dispatch(getRestaurantsList(values)),
    deleteRestaurant: (id, callback) => dispatch(deleteRestaurant(id, callback)),
  }),
)(Restaurants);
