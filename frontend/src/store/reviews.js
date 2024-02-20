import { csrfFetch } from './csrf.js';


/** Action Type Constants: */
export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';

/**  Action Creators: */
export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
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
    //   case RECEIVE_SPOT:
    //     return { ...state, [action.spot.id]: action.spot };
    //   case UPDATE_REPORT:
    //     return { ...state, [action.report.id]: action.report };
    //   case REMOVE_REPORT: {
    //     const newState = { ...state };
    //     delete newState[action.reportId];
    //     return newState;
    //   }
      default:
        return state;
    }
  };
  
  export default reviewsReducer;