
import { combineReducers } from 'redux';

import dadJoke from './silly/dadJokeReducer';

const rootReducer = combineReducers({ 
  dadJoke
});

export default rootReducer;