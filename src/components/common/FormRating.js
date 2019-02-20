import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import StarRatings from 'react-star-ratings';

const renderStarRating = ({
  input,
  stars,
  starDimension,
  starSpacing,
  meta: { touched, error },
}) => {
  return (
    <FormGroup className="custom-form-group">
      <StarRatings
        numberOfStars={Number(stars)}
        rating={Number(input.value)}
        changeRating={value => input.onChange(value)}
        starRatedColor="rgb(230, 67, 47)"
        starHoverColor="rgb(230, 67, 47)"
        starDimension={starDimension || '30px'}
        starSpacing={starSpacing || '5px'}
      />
      {touched && error && <FormFeedback>{error}</FormFeedback>}
    </FormGroup>
  );
};

renderStarRating.propTypes = {
  stars: PropTypes.number.isRequired,
};

export default renderStarRating;
