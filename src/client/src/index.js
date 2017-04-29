// @flow
import React from 'react';
import { render } from 'react-snapshot';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';

import configureStore from './store/configureStore';

import Utils from './helpers/utils';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.css';

import './index.css';

import Routes from './routes';

const store = configureStore();

// -------------------------------------------------------------------

const BindRedirect = withRouter((props) => {
  // define Utils.redirect function, so that we can use it later
  Utils.redirect = (path = '/') => {
    if (props.history) {
      props.history.push(path);
    }
  }
  //
  return (<span className="BindRedirect"></span>)
});

// -------------------------------------------------------------------

const Root = (props) => {
  return (
    <Provider store={props.store}>
      <Router>
        <div style={{ height: '100%' }}>
          <BindRedirect />
          <Routes />
          {props.children}
        </div>
      </Router>
    </Provider>
  );
}

// -------------------------------------------------------------------

render(<Root store={store} />, document.getElementById('root'));
