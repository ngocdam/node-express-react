// @flow
import React from 'react';
import { render } from 'react-snapshot';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import configureStore from './store/configureStore';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';

import './index.css';

import Routes from './routes';

const store = configureStore();

const Root = (props) => {
  return (
    <Provider store={props.store}>
      <Router>
        <div style={{ height: '100%' }}>
          <Routes />
          {props.children}
        </div>
      </Router>
    </Provider>
  );
}

render(<Root store={store} />, document.getElementById('root'));
