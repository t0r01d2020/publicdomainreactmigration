import { createLogic } from 'redux-logic';
import axios from 'axios';

import { 
  GET_RANDOM_DAD_JOKE, 
  GET_RANDOM_DAD_JOKE_SUCCESS, 
  GET_RANDOM_DAD_JOKE_FAILURE 
} from '../../actions/types';


// If we want to just test w/out making an API call we can create a mock response
// import mockResponse from './__mockdata__/mockData';
let dataProvider = axios;
// dataProvider = mockResponse;

// This would actually just point to our hapi server endpoint
let requestConfig = {
  "method":"GET",
  "url":`https://icanhazdadjoke.com/`,
  "headers":{
    "accept": "application/json"
  }
};

const dadJokeSearchLogic = createLogic({
  type: GET_RANDOM_DAD_JOKE, // only apply this "logic" to this action type
  latest: true, // only provide the lastest response if fired off many times (though should never happen)
  processOptions: {
    dispatchReturn: true, // more auto-magic configuration, dispatch success/failure action types immediately
    successType: GET_RANDOM_DAD_JOKE_SUCCESS, 
    failType: GET_RANDOM_DAD_JOKE_FAILURE
  },

  // define our async promise within a logic 'process'
  process({ action }) {
    console.log('dadJokeSearchLogic is processing an action >> ');
    console.log('type: ' + action.type);
    console.log('payload: ' + JSON.stringify(action.payload));
    

    return dataProvider(requestConfig)
      .then(response => {
          console.log('got response for dadJokeSearchLogic GET request >>> ');
          console.log(JSON.stringify(response.data,null,1));
          return response.data;
        });
  }

});

export default [ dadJokeSearchLogic ];