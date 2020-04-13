import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

// Reduxinary Things
import { Provider } from 'react-redux';
import store from './redux/appstore';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './components/App';

ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>,
  document.getElementById('root')
);
