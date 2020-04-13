
import { combineReducers } from 'redux';

import dadJoke from './silly/dadJokeReducer';
import userInfo from './user/userInfoReducer';

const rootReducer = combineReducers({ 
  dadJoke,
  userInfo
});

export default rootReducer;