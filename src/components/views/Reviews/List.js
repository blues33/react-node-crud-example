import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardFooter, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import StarRatings from 'react-star-ratings';
import moment from 'moment';

import { fetchPendingReviews, submitReply } from '../../../actions/reviews';

class PendingReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedReview: null,
      replyText: '',
    };
  }

  componentDidMount() {
    this.props.fetchReviews();
  }

  reply = (review) => {
    this.setState({
      isModalOpen: true,
      selectedReview: review,
      replyText: '',
    });
  }

  toggle = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  onReplyChange = (e) => {
    this.setState({
      replyText: e.target.value,
    });
  }

  submitReply = () => {
    this.props.submitReply({
      replyComment: this.state.replyText,
      reviewId: this.state.selectedReview._id,
    });
    this.setState({
      isModalOpen: false
    });
  }

  render() {
    const { user, pendingReviews } = this.props;
    return (
      <div className="animated fadeIn h-100 w-100">
        {pendingReviews.map((review, i) => (
        <Card key={`review-${i}`}>
          <CardBody>
            <div className="space-between align-middle">
              <div>
                <div className="align-middle m-b-10">
                  <span className="m-r-20 m-t-5"><strong>{review.user.fullname}</strong></span>
                  <StarRatings
                    rating={review.rate}
                    starRatedColor="rgb(230, 67, 47)"
                    starDimension="20px"
                    starSpacing="0px"
                  />
                </div>
                <div className="m-b-10">{moment(review.created).format('MM-DD-YYYY')}</div>
                <p>{ review.comment }</p>
              </div>
              <Button color="primary" onClick={() => this.reply(review)}>Reply</Button>
            </div>
          </CardBody>
        </Card>
        ))}
        <Modal isOpen={this.state.isModalOpen}>
          <ModalHeader toggle={this.toggle}>Reply</ModalHeader>
          <ModalBody>
            <Input type="textarea" className="form-control" placeholder="Reply comment here..." value={this.state.replyText} onChange={this.onReplyChange} />
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

export default connect(
  ({ reviews, authentication, }) => ({
    ...reviews,
    ...authentication,
  }),
  dispatch => ({
    fetchReviews: (userId) => dispatch(fetchPendingReviews(userId)),
    submitReply: (reply) => dispatch(submitReply(reply)),
  }),
)(PendingReviews);
