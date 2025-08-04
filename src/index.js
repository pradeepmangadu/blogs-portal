import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import configureAppStore from './app/store/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
const initialState = {};
const store = configureAppStore(initialState);
const persistor = persistStore(store);
root.render(
  <React.StrictMode>
    <Provider store = {store}>
      <PersistGate loading ={null} persistor = {persistor}>
    <App />
    </PersistGate>
    </Provider>
  </React.StrictMode>
);

if(module.hot){
  module.hot.accept();
}
