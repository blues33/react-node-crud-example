import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import StarRatings from 'react-star-ratings';
import Slider from 'rc-slider';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

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
    this.props.history.push('/restaurant/add');
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
    this.props.history.push(`/restaurant/edit/${restaurant._id}`);
  };

  viewRestaurant = (restaurant) => {
    this.props.history.push(`/restaurant/detail/${restaurant._id}`);
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
          min: this.state.minRate,
          max: this.state.maxRate,
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
    const columns = [{
      dataField: '_id',
      text: '#',
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      classes: 'column-number',
      headerClasses: 'column-number'
    },
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
    }, {
      dataField: 'owner.fullname',
      text: 'Owner',
      sort: true,
    }, {
      dataField: 'rateAvg',
      text: 'Average rating',
      sort: true,
      formatter: (cell, row, rowIndex) => cell > 0 ? (
        <StarRatings
          rating={cell}
          starRatedColor="rgb(230, 67, 47)"
          starDimension="20px"
          starSpacing="0px"
        />
        ) : <i>No review</i>,
      classes: 'td-rating',
      headerClasses: 'td-rating',
    }, {
      dataField: '',
      text: 'Actions',
      formatter: (cell, row, rowIndex) => (
        <>
        <Button color="primary" className="m-l-5 m-r-5 m-b-10" onClick={() => this.viewRestaurant(row)}>
          View
        </Button>
        {user.role !== 'regular' && 
        <>
        <Button color="warning" className="m-l-5 m-r-5 m-b-10" onClick={() => this.onEdit(row)}>
          Edit
        </Button>
        <Button color="danger" onClick={() => this.onDelete(row)} className="m-l-5 m-r-5 m-b-10">
          Delete
        </Button>
        </>
        }
        </>
      ),
      align: 'center',
      headerAlign: 'center'
    }];
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
        <BootstrapTable
          bootstrap4
          keyField='_id'
          data={ restaurants }
          columns={ columns }
          pagination={ paginationFactory() }
          noDataIndication="No result found"
          striped
          hover
        />

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
