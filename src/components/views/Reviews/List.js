import * as React from 'react';
import { connect } from 'react-redux';
import {
  Button, Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import StarRatings from 'react-star-ratings';
import moment from 'moment';

import { fetchPendingReviews, submitReply } from '../../../actions/reviews';
import { replyFormValidate } from '../../../utils/validate';
import renderInput from '../../common/FormInput';

class PendingReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.fetchReviews();
  }

  reply = (review) => {
    this.props.reset();
    this.props.change('reviewId', review._id);
    this.setState({
      isModalOpen: true,
    });
  }

  toggle = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  submitReply = (e) => {
    this.props.handleSubmit(e);
    if (this.props.valid) {
      this.setState({
        isModalOpen: false,
      });
    }
  }

  render() {
    const { pendingReviews } = this.props;
    return (
      <div className="animated fadeIn h-100 w-100">
        {pendingReviews.length > 0
          ? pendingReviews.map((review, i) => (
          <Card key={`review-${i}`}>
            <CardBody>
              <div className="space-between align-middle">
                <div><h4>{review.restaurant.name}</h4></div>
                <div>{moment(review.created).format('MM-DD-YYYY hh:mm a')}</div>
              </div>
              <div className="space-between align-middle">
                <div>
                  <div className="align-middle m-b-10">
                    <StarRatings
                      rating={review.rate}
                      starRatedColor="rgb(230, 67, 47)"
                      starDimension="20px"
                      starSpacing="0px"
                    />
                    <span className="m-l-20 m-t-5"><strong>{review.user.fullname}</strong> visited on {moment(review.visited).format('MM-DD-YYYY')}</span>
                  </div>
                  <p>{ review.comment }</p>
                </div>
                <Button color="primary" onClick={() => this.reply(review)}>Reply</Button>
              </div>
            </CardBody>
          </Card>
          ))
          : <div className="align-center"><h4>No pending reviews</h4></div>
        }
        <Modal isOpen={this.state.isModalOpen}>
          <ModalHeader toggle={this.toggle}>Reply</ModalHeader>
          <ModalBody>
            <Field
              name="replyComment"
              type="textarea"
              label="Reply comment"
              component={renderInput}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.submitReply}>Reply</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const ReduxForm = reduxForm({
  form: 'ReplyForm',
  onSubmit: (values, dispatch, props) => {
    props.submitReply(values);
  },
  validate: replyFormValidate,
})(PendingReviews);

export default connect(
  ({ reviews, authentication }) => ({
    ...reviews,
    ...authentication,
  }),
  dispatch => ({
    fetchReviews: userId => dispatch(fetchPendingReviews(userId)),
    submitReply: reply => dispatch(submitReply(reply)),
  }),
)(ReduxForm);
