import { createLogic } from 'redux-logic';
import axios from 'axios';

import { 
  GET_CHUCK_NORRIS_RANDOM_JOKE, 
  GET_CHUCK_NORRIS_RANDOM_JOKE_SUCCESS, 
  GET_CHUCK_NORRIS_RANDOM_JOKE_FAILURE 
} from '../../actions/types';


// If we want to just test w/out making an API call we can create a mock response
// import mockResponse from './__mockdata__/mockData';
let dataProvider = axios;
// dataProvider = mockResponse;

// This would actually just point to our hapi server endpoint
let requestConfig = {
  "method":"GET",
  "url":"https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random",
  "headers":{
    "x-rapidapi-host": "matchilling-chuck-norris-jokes-v1.p.rapidapi.com",
    "x-rapidapi-key": "410e96c351msh606cded42616434p131499jsn54959d9c3a74",
    "accept": "application/json"
  }
};

const chuckNorrisJokeSearchLogic = createLogic({
  type: GET_CHUCK_NORRIS_RANDOM_JOKE, // only apply this "logic" to this action type
  latest: true, // only provide the lastest response if fired off many times (though should never happen)
  processOptions: {
    dispatchReturn: true, // more auto-magic configuration, dispatch success/failure action types immediately
    successType: GET_CHUCK_NORRIS_RANDOM_JOKE_SUCCESS, 
    failType: GET_CHUCK_NORRIS_RANDOM_JOKE_FAILURE
  },

  // define our async promise within a logic 'process'
  process({ action }) {
    console.log('chuckNorrisJokeSearchLogic is processing an action >> ');
    console.log('type: ' + action.type);
    console.log('payload: ' + JSON.stringify(action.payload));
    

    return dataProvider(requestConfig)
      .then(response => {
          console.log('got response for chuckNorrisJokeSearchLogic GET request >>> ');
          console.log(JSON.stringify(response.data,null,1));
          return response.data;
        });
  }

});

export default [ chuckNorrisJokeSearchLogic ];