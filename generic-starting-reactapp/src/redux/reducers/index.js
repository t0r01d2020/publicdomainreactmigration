
import { combineReducers } from 'redux';

import norrisJoke from './silly/chuckNorrisJokeReducer';

const rootReducer = combineReducers({ 
  norrisJoke
});

export default rootReducer;