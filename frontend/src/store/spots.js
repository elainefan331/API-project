import { csrfFetch } from './csrf.js';

/** Action Type Constants: */
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';

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
  
  export default spotsReducer;