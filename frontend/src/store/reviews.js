import { csrfFetch } from './csrf.js';


/** Action Type Constants: */
export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
export const RECEIVE_REVIEW = 'reviews/RECEIVE_REVIEW';
export const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

/**  Action Creators: */
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
});

export const receiveReview = (review) => ({
  type: RECEIVE_REVIEW,
  review
});

export const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId
});

  /** Thunk Action Creators: */
export const getReviewsBySpotIdThunk = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const reviews = await response.json();
    dispatch(loadReviews(reviews))
}

export const createReviewThunk = (review, spotId) => async(dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(review)
  });
  if(response.ok) {
    const newReview = await response.json();
    dispatch(receiveReview(newReview));
    return newReview;
  }
}

export const deleteReviewThunk = (reviewId) => async(dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  });
  if(response.ok) {
    dispatch(removeReview(reviewId))
  } else {
    const error = response.json()
    return error
  }
}

// /** Reducer: */

/** The reports reducer is complete and does not need to be modified */
const reviewsReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAD_REVIEWS: {
        const reviewsState = {};
        action.reviews.Reviews.forEach((review) => {
          reviewsState[review.id] = review;
        });
        return reviewsState;
      }
      case RECEIVE_REVIEW: 
        return { ...state, [action.review.id]: action.review };
    //   case UPDATE_REPORT:
    //     return { ...state, [action.report.id]: action.report };
      case REMOVE_REVIEW: {
        const newState = { ...state };
        delete newState[action.reviewId];
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default reviewsReducer;