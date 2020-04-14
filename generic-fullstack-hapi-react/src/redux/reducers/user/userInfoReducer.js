


import {
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE
} from '../../actions/types';

const initialState = {
  firstName: null,
  lastName: null,
  email: null,
  info : null
};

// Search for customers associated with a particular vehicle
const userInfoReducer = ( state = initialState, action = {payload:{}} ) => {

    let newState = { ...state };
    let actionType = ( action && action.type ) || 'default';
    let responseData = action.payload || {};

    console.log(`userInfoReducer >> ${actionType}`);
    console.log(action.payload);

    switch (actionType) {

      case GET_USER_INFO:
        newState = { ...initialState };
        return newState;
        
      case GET_USER_INFO_SUCCESS:
        let {
          firstName, 
          lastName,
          email,
          data
        } = responseData;
        newState['firstName'] = firstName;
        newState['lastName'] = lastName;
        newState['email'] = email;
        newState['info'] = data || null;

        return newState;

      case GET_USER_INFO_FAILURE:
        newState['firstName'] = null;
        newState['lastName'] = null;
        newState['email'] = null;
        newState['info'] = null;
        return newState;

      default:
        return newState;
    }

};

export default userInfoReducer;