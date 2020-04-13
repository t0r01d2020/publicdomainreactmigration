
import {
  GET_RANDOM_DAD_JOKE,
  GET_RANDOM_DAD_JOKE_SUCCESS,
  GET_RANDOM_DAD_JOKE_FAILURE,
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE
} from './types';


export const getChuckNorrisRandomJoke = payload => {
  return {
    type: GET_RANDOM_DAD_JOKE,
    payload
  };
};

export const getChuckNorrisRandomJokeSuccess = payload => {
  return {
    type: GET_RANDOM_DAD_JOKE_SUCCESS,
    payload
  };
};

export const getChuckNorrisRandomJokeFailure = payload => {
  return {
    type: GET_RANDOM_DAD_JOKE_FAILURE,
    payload
  };
};



export const getUserInfo = payload => {
  return {
    type: GET_USER_INFO,
    payload  
  };
};

export const getUserInfoSuccess = payload => {
  return {
    type: GET_USER_INFO_SUCCESS,
    payload  
  };
};

export const getUserInfoFailure = payload => {
  return {
    type: GET_USER_INFO_FAILURE,
    payload  
  };
};
