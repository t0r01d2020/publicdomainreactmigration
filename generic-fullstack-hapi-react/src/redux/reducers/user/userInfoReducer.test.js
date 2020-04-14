
import {
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE
} from '../../actions/types';

import userInfoReducer from './userInfoReducer';

const initialState = {
  firstName: null,
  lastName: null,
  email: null,
  info : null
};

// reset state of userInfoReducer before each test
beforeEach( () => {
  userInfoReducer( initialState, {type:'DEFAULT'}) 
});

it('should return the initial state when it receives a GET_USER_INFO action', () => {
  let newState = userInfoReducer( {}, { type:GET_USER_INFO } );
  expect(newState.firstName).toEqual(null);
  expect(newState.lastName).toEqual(null);
  expect(newState.email).toEqual(null);
  expect(newState.info).toEqual(null);
});

it('should return values obtained from the payload when it receives a GET_USER_INFO_SUCCESS action', () => {
  let firstName = 'LongFirstName', lastName = 'lastName', email='user@email.org', data={'a':'a', 'b':'b'};
  let payload = { firstName, lastName, email, data };
  let newState = userInfoReducer( {}, { type:GET_USER_INFO_SUCCESS, payload } );
  expect(newState.firstName).toEqual(firstName);
  expect(newState.lastName).toEqual(lastName);
  expect(newState.email).toEqual(email);
  expect(JSON.stringify(newState.info)).toEqual(JSON.stringify(data));
});

it('should return the initial state when it receives a GET_USER_INFO_FAILURE action', () => {
  let newState = userInfoReducer( {}, { type:GET_USER_INFO_FAILURE } );
  expect(newState.firstName).toEqual(null);
  expect(newState.lastName).toEqual(null);
  expect(newState.email).toEqual(null);
  expect(newState.info).toEqual(null);
});

it('should return whatever state is present when it receives an unexpected action', () => {
  let expectedState = { 'a' : 'a'};
  let newState = userInfoReducer(expectedState, { type: 'UNKNOWN_TYPE_OF_ACTION_OH_NOES' });
  expect(JSON.stringify(newState)).toEqual(JSON.stringify(expectedState));
});
