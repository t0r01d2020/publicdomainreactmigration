


import {
  GET_CHUCK_NORRIS_RANDOM_JOKE,
  GET_CHUCK_NORRIS_RANDOM_JOKE_SUCCESS,
  GET_CHUCK_NORRIS_RANDOM_JOKE_FAILURE
} from '../../actions/types';

const initialState = {
  joke : null
};

// Search for customers associated with a particular vehicle
const norrisJokeReducer = ( state = initialState, action = {payload:{}} ) => {

    let newState = { ...state };
    let actionType = ( action && action.type ) || 'default';
    let responseData = action.payload || {};

    console.log(`norrisJokeReducer >> ${actionType}`);
    console.log(action.payload);

    switch (actionType) {

      case GET_CHUCK_NORRIS_RANDOM_JOKE:
        newState.joke = null;
        return newState;
        
      case GET_CHUCK_NORRIS_RANDOM_JOKE_SUCCESS:
        newState.joke = responseData;
        return newState;

      case GET_CHUCK_NORRIS_RANDOM_JOKE_FAILURE:
        newState.joke = null;
        return newState;

      default:
        return newState;
    }

};

export default norrisJokeReducer;