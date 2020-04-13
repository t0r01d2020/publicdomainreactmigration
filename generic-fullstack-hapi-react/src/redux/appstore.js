
import axios from 'axios';
import { applyMiddleware, compose, createStore } from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import rootReducer from './reducers';
import rootLogic from './logic';

const logicDependencies = {
  httpClient: axios
};

// create and configure/compose middleware for usage
const logicMiddleware = createLogicMiddleware(rootLogic, logicDependencies);
const composeMiddleWare = compose(applyMiddleware(logicMiddleware));

// export the redux store for application usage
export default createStore(rootReducer, composeMiddleWare);


