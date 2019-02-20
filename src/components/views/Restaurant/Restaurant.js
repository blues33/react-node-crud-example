import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Label, FormGroup, Card, CardBody, CardHeader, CardFooter, 
  Modal, ModalHeader, ModalBody, ModalFooter, Input, FormFeedback } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import moment from 'moment';
import StarRatings from 'react-star-ratings';

import renderInput from '../../common/FormInput';
import renderDatePicker from '../../common/FormDatepicker';
import renderStarRating from '../../common/FormRating';
import ConfirmModal from '../../common/ConfirmModal';
import { getRestaurantInfo } from '../../../actions/restaurants';
import { addReview, getReviewsList, updateReview, deleteReview, submitReply } from '../../../actions/reviews';
import { reviewFormValidate } from '../../../utils/validate';

export class Restaurant extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedReview: null,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      rate: 0,
      comment: '',
      replyText: '',
      isReplyModalOpen: false,
      replyComment: '',
      replyError: '',
    };
  }

  componentDidMount() {
    this.props.getRestaurant(this.props.match.params.id);
    this.props.getReviews(this.props.match.params.id);
  }

  toggleReplyModal = () => {
    this.setState({
      isReplyModalOpen: !this.state.isReplyModalOpen,
    });
  }

  onReply = (review) => {
    this.setState({
      selectedReview: review,
      isReplyModalOpen: true,
      replyComment: '',
    });
  }

  onReplyCommentChange = (e) => {
    const value = e.target.value;
    const state = {replyComment: value};
    if (!value) {
      state.replyError = 'Required';
    }
    this.setState(state);
  }

  submitReply = () => {
    if (!this.state.replyComment) {
      this.setState({replyError: 'Required'});
      return;
    }
    this.props.submitReply({
      reviewId: this.state.selectedReview._id,
      replyComment: this.state.replyComment,
      isReplyModalOpen: false,
    });
  }

  toggleEditModal = () => {
    this.setState({
      isEditModalOpen: !this.state.isEditModalOpen,
    });
  }

  onEdit = (review) => {
    this.setState({
      selectedReview: review,
      isEditModalOpen: true,
      rate: review.rate,
      comment: review.comment,
      replyText: review.replyComment,
    });
  }

  changeRating = (rate) => {
    this.setState({ rate });
  }

  onCommentChange = (e) => {
    this.setState({ comment: e.target.value });
  }
  
  onReplyChange = (e) => {
    this.setState({ replyText: e.target.value });
  }

  editReview = () => {
    this.setState({ isEditModalOpen: false });
    this.props.updateReview({
      ...this.state.selectedReview,
      comment: this.state.comment,
      replyComment: this.state.replyText,
      rate: this.state.rate,
    });
  }

  onDelete = (review) => {
    this.setState({
      isDeleteModalOpen: true,
      selectedReview: review,
    });
  }

  toggleDeleteModal = () => {
    this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen });
  }

  onConfirmDelete = () => {
    this.setState({ isDeleteModalOpen: false })
    this.props.deleteReview(this.state.selectedReview._id);
  }

  handleCancel = e => {
    this.props.history.push('/restaurants');
  };

  render() {
    return (
      <div className="animated fadeIn h-100 w-100">
      {this.props.restaurant ?
        <Row>
          <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 12}>
            <Card>
              <CardHeader>
                <strong>Overview</strong>
              </CardHeader>
              <CardBody>
                <FormGroup row>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 3}>
                    <Label><strong>Name</strong></Label>
                  </Col>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 9}>
                    <p className="form-control-static">{this.props.restaurant.name}</p>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 3}>
                    <Label><strong>Owner</strong></Label>
                  </Col>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 9}>
                    <p className="form-control-static">{this.props.restaurant.owner.fullname}</p>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 3}>
                    <Label><strong>Average rating</strong></Label>
                  </Col>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 9}>
                  { this.props.restaurant.rateAvg > 0 ?
                    <div style={{marginBottom: '1em'}}>
                      <StarRatings
                        rating={this.props.restaurant.rateAvg}
                        starRatedColor="rgb(230, 67, 47)"
                        starDimension="20px"
                        starSpacing="0px"
                      />
                    </div>
                    : <div style={{marginBottom: '1em'}}><i>No review</i></div>
                  }
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 3}>
                    <Label><strong>Highest rated review</strong></Label>
                  </Col>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 9}>
                  { this.props.restaurant.highestReview ?
                    <div>
                      <StarRatings
                        rating={this.props.restaurant.highestReview.rate}
                        starRatedColor="rgb(230, 67, 47)"
                        starDimension="20px"
                        starSpacing="0px"
                      />
                      <p className="form-control-static">
                        {this.props.restaurant.highestReview.comment}
                      </p>
                    </div>
                    : <div><i>No review</i></div>
                  }
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 3}>
                    <Label><strong>Lowest rated review</strong></Label>
                  </Col>
                  <Col xs="12" md={this.props.user.role === 'regular' ? 6 : 9}>
                  { this.props.restaurant.lowestReview ?
                    <div>
                      <StarRatings
                        rating={this.props.restaurant.lowestReview.rate}
                        starRatedColor="rgb(230, 67, 47)"
                        starDimension="20px"
                        starSpacing="0px"
                      />
                      <p className="form-control-static">
                        {this.props.restaurant.lowestReview.comment}
                      </p>
                    </div>
                    : <div><i>No review</i></div>
                  }
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="12">
                    <Label><strong>Reviews</strong></Label>
                  </Col>
                  <Col md="12">
                  {this.props.reviews.map((review, i) =>
                    <Card key={`review-${i}`}>
                      <CardBody>
                        <div className="space-between m-b-20 align-middle">
                          <div className="align-middle">
                            <span className="m-r-20 m-t-5"><strong>{review.user.fullname}</strong></span>
                            <StarRatings
                              rating={review.rate}
                              starRatedColor="rgb(230, 67, 47)"
                              starDimension="20px"
                              starSpacing="0px"
                            />
                          </div>
                          <div>{moment(review.created).format('MM-DD-YYYY hh:mm a')}</div>
                        </div>
                        <p className="form-control-static">
                          <i>Visited on </i>{ moment(review.visited).format('MM-DD-YYYY') }
                        </p>
                        <p className="form-control-static">
                          { review.comment }
                        </p>
                        <div className="m-b-10"><strong>Reply</strong></div>
                        <i>
                          {review.status === 'pending' ? 'Pending' : review.replyComment}
                        </i>
                      </CardBody>
                      {this.props.user.role === 'owner' && review.status === 'pending' &&
                      <CardFooter className="align-end">
                        <Button color="primary" onClick={() => this.onReply(review)}>Reply</Button>
                      </CardFooter>
                      }
                      {this.props.user.role === 'admin' &&
                      <CardFooter className="align-end">
                        <Button color="warning" onClick={() => this.onEdit(review)}>Edit</Button>
                        <Button color="danger" className="m-l-10" onClick={() => this.onDelete(review)}>Delete</Button>
                      </CardFooter>
                      }
                    </Card>
                  )}
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          {this.props.user.role === 'regular' &&
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>My review</strong>
                </CardHeader>
                <CardBody>
                  {this.props.myReview ?
                  <>
                    <FormGroup row>
                      <Col md="6">
                        <Label><strong>Rating</strong></Label>
                      </Col>
                      <Col md="6" style={{marginBottom: '1em'}}>
                        <StarRatings
                          rating={this.props.myReview.rate}
                          starRatedColor="rgb(230, 67, 47)"
                          starDimension="30px"
                          starSpacing="5px"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6">
                        <Label><strong>Date visited</strong></Label>
                      </Col>
                      <Col md="6">
                        <p className="form-control-static">{moment(this.props.myReview.visited).format('MM-DD-YYYY')}</p>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6">
                        <Label><strong>Comment</strong></Label>
                      </Col>
                      <Col md="6">
                        <p className="form-control-static">{this.props.myReview.comment}</p>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="6">
                        <Label><strong>Reply</strong></Label>
                      </Col>
                      <Col md="6">
                        <p className="form-control-static">
                          {this.props.myReview.status === 'pending' ? <i>Pending</i> : this.props.myReview.replyComment}
                        </p>
                      </Col>
                    </FormGroup>
                  </>
                  : 
                  <>
                    <label>Rating</label>
                    <Field
                      name="rate"
                      component={renderStarRating}
                      stars={5}
                    />
                    <Field
                      name="visited"
                      label="Date visited"
                      maxDate={new Date()}
                      component={renderDatePicker}
                    />
                    <Field
                      name="comment"
                      type="textarea"
                      label="Comment"
                      component={renderInput}
                    />
                    <div className="d-flex justify-content-between align-items-center">
                      <Button color="primary" onClick={this.props.handleSubmit}>
                        Comment
                      </Button>
                    </div>
                  </>
                  }
                </CardBody>
              </Card>
            </Col>
          }
        </Row>
        : <div className="align-center"><h4>Restaurant does not exist</h4></div>
      }
        <Modal isOpen={this.state.isReplyModalOpen}>
          <ModalHeader toggle={this.toggleReplyModal}>Reply</ModalHeader>
          <ModalBody>
            <Label><strong>Reply comment</strong></Label>
            <Input type="textarea" className="form-control" value={this.state.replyComment} onChange={this.onReplyCommentChange} />
            {this.state.replyError && <FormFeedback>{this.state.replyError}</FormFeedback>}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.submitReply}>Reply</Button>{' '}
            <Button color="secondary" onClick={this.toggleReplyModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.isEditModalOpen}>
          <ModalHeader toggle={this.toggleEditModal}>Edit Review</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label><strong>Rating</strong></Label>
              <div className="m-b-10">
                <StarRatings
                  rating={this.state.rate}
                  starRatedColor="rgb(230, 67, 47)"
                  starDimension="30px"
                  starSpacing="5px"
                  changeRating={this.changeRating}
                  numberOfStars={5}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label><strong>Comment</strong></Label>
              <Input type="textarea" className="form-control" value={this.state.comment} onChange={this.onCommentChange} />
            </FormGroup>
            {this.state.selectedReview && this.state.selectedReview.status !== 'pending' &&
            <FormGroup>
              <Label><strong>Reply comment</strong></Label>
              <Input type="textarea" className="form-control" value={this.state.replyText} onChange={this.onReplyChange} />
            </FormGroup>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editReview}>Update</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <ConfirmModal
          isOpen={this.state.isDeleteModalOpen}
          type="danger"
          confirmText="Delete"
          title="Confirmation"
          text="Are you sure you want to delete the review?"
          toggleModal={this.toggleDeleteModal}
          onConfirm={this.onConfirmDelete}
          onCancel={this.toggleDeleteModal}
        />
      </div>
    );
  }
}

const ReduxForm = reduxForm({
  form: 'ReviewForm',
  onSubmit: (values, dispatch, props) => {
    props.addReview({
      ...values,
      restaurant: props.match.params.id,
    });
  },
  validate: reviewFormValidate,
})(Restaurant);

export default connect(
  ({ authentication, restaurants, reviews }, props) => {
    const myReview = reviews.reviews.find(review => review.user._id === authentication.user._id)
    return {
      ...authentication,
      ...reviews,
      myReview,
      restaurant: restaurants.currentRestaurant,
    }
  },
  dispatch => ({
    getRestaurant: (id) => dispatch(getRestaurantInfo(id)),
    getReviews: (id) => dispatch(getReviewsList(id)),
    addReview: (values) => dispatch(addReview(values)),
    updateReview: (values) => dispatch(updateReview(values)),
    deleteReview: (id) => dispatch(deleteReview(id)),
    submitReply: (reply) => dispatch(submitReply(reply)),
  }),
)(ReduxForm);
