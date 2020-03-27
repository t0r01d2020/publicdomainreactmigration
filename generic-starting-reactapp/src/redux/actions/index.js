
import {
  GET_CHUCK_NORRIS_RANDOM_JOKE,
  GET_CHUCK_NORRIS_RANDOM_JOKE_SUCCESS,
  GET_CHUCK_NORRIS_RANDOM_JOKE_FAILURE
} from './types';


export const getChuckNorrisRandomJoke = payload => {
  return {
    type: GET_CHUCK_NORRIS_RANDOM_JOKE,
    payload
  };
};

export const getChuckNorrisRandomJokeSuccess = payload => {
  return {
    type: GET_CHUCK_NORRIS_RANDOM_JOKE_SUCCESS,
    payload
  };
};

export const getChuckNorrisRandomJokeFailure = payload => {
  return {
    type: GET_CHUCK_NORRIS_RANDOM_JOKE_FAILURE,
    payload
  };
};