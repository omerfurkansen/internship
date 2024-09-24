// eslint-disable-next-line import/no-unresolved
import '@jotforminc/router-bridge/init';

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './components/App';
import rootReducer from './reducers';
import '@jotforminc/jotform.css/reset.css';
import '@jotforminc/jotform.css';

const store = createStore(rootReducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
