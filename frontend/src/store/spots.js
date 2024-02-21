import { csrfFetch } from './csrf.js';

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';
export const RECEIVE_IMAGE = 'spots/RECEIVE_IMAGE';
// export const RECEIVE_REVIEW = 'spots/RECEIVE_REVIEW';

/**  Action Creators: */
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
  });
  
  export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot
  });
  
  export const editSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot
  });
  
  export const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId
  });

export const receiveImage = (image, spotId) => ({
  type: RECEIVE_IMAGE,
  image,
  spotId
});

// export const receiveReview = (review, spotId) => ({
//   type: RECEIVE_REVIEW,
//   review,
//   spotId
// });

  /** Thunk Action Creators: */

// Your code here 
export const getAllSpotsThunk = () => async(dispatch) => {
    const response = await csrfFetch('/api/spots', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });
    const spots = await response.json();
    console.log("spots in thunk", spots)
    dispatch(loadSpots(spots))
  }

export const getSpotsOwnedByUserThunk = () => async(dispatch) => {
    const response = await csrfFetch('/api/spots/current', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });
    const spots = await response.json();
    dispatch(loadSpots(spots))
}

export const getSpotDetailThunk = (spotId) => async(dispatch) => {
    console.log("spotId in thunk", spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const spot = await response.json();
    console.log("spot in thunk", spot)
    dispatch(receiveSpot(spot))
}


export const createSpotThunk = (spot) => async(dispatch) => {
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(spot)
    });
    if(response.ok) {
      const newSpot = await response.json();
      dispatch(receiveSpot(newSpot));
      return newSpot
    } 
  } catch(e) {
    const error = await e.json()
    const errorObj = error.errors
    console.log("errors in createSpotThunk", errorObj)
    return errorObj
  }
}

export const createImageThunk = (image, spotId) => async(dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(image)
  });
  if(response.ok) {
    const newImage = await response.json();
    dispatch(receiveImage(newImage, spotId));
    return newImage;
  }
}

// export const createReviewThunk = (review, spotId) => async(dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify(review)
//   });
//   if(response.ok) {
//     const newReview = await response.json();
//     dispatch(receiveReview(newReview, spotId));
//     return newReview;
//   }
// }

export const updateSpotThunk = (spot, spotId) => async(dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method:'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(spot)
  });
  if(response.ok) {
    const updatedSpot = await response.json();
    dispatch(editSpot(updatedSpot))
    return updatedSpot
  }
}

export const deleteSpotThunk = (spotId) => async(dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  });
  if(response.ok) {
    dispatch(removeSpot(spotId))
  } else {
    const error = response.json()
    return error
  }

}



  /** Reducer: */

/** The reports reducer is complete and does not need to be modified */
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
      case LOAD_SPOTS: {
        const spotsState = {};
        action.spots.Spots.forEach((spot) => {
          spotsState[spot.id] = spot;
        });
        return spotsState;
      }
      case RECEIVE_SPOT:
        return { ...state, [action.spot.id]: action.spot };
      case RECEIVE_IMAGE: {
        const newState = {...state};
        const spotId = action.spotId;
        const newImage = action.image;
        if(newState[spotId]) {
          if (!Array.isArray(newState[spotId].SpotImages)) {
            newState[spotId].SpotImages = [];
          }
          newState[spotId].SpotImages = [...newState[spotId].SpotImages, newImage]
        }
        return newState;
      }
      // case RECEIVE_REVIEW: {
      //   const newState = {...state};
      //   const spotId = action.spotId;
      //   const newReview = action.review;
      //   if(newState[spotId]) {
      //     if (!Array.isArray(newState[spotId].Reviews)) {
      //       newState[spotId].Reviews = [];
      //     }
      //     newState[spotId].Reviews = [...newState[spotId].Reviews, newReview]
      //   }
      //   return newState;
      // }
      case UPDATE_SPOT:
        return { ...state, [action.spot.id]: action.spot };
      case REMOVE_SPOT: {
        const newState = { ...state };
        delete newState[action.spotId];
        return newState;
      }
      default:
        return state;
    }
  };
  
  export default spotsReducer;