
import {
  GET_RANDOM_DAD_JOKE,
  GET_RANDOM_DAD_JOKE_SUCCESS,
  GET_RANDOM_DAD_JOKE_FAILURE
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