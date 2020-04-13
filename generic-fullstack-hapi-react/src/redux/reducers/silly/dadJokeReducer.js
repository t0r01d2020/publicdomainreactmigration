


import {
  GET_RANDOM_DAD_JOKE,
  GET_RANDOM_DAD_JOKE_SUCCESS,
  GET_RANDOM_DAD_JOKE_FAILURE
} from '../../actions/types';

const initialState = {
  joke : null
};

// Search for customers associated with a particular vehicle
const dadJokeReducer = ( state = initialState, action = {payload:{}} ) => {

    let newState = { ...state };
    let actionType = ( action && action.type ) || 'default';
    let responseData = action.payload || {};

    console.log(`dadJokeReducer >> ${actionType}`);
    console.log(action.payload);

    switch (actionType) {

      case GET_RANDOM_DAD_JOKE:
        newState.joke = null;
        return newState;
        
      case GET_RANDOM_DAD_JOKE_SUCCESS:
        newState.joke = ( responseData && responseData.joke ) || null;
        return newState;

      case GET_RANDOM_DAD_JOKE_FAILURE:
        newState.joke = null;
        return newState;

      default:
        return newState;
    }

};

export default dadJokeReducer;