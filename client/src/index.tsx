import * as React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
// import createStore from './createReduxStore'
import { store } from './store/store';
import App from './App';
// const store = createStore()

const appRoot = document.getElementById('app');

const root = createRoot(appRoot);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
