// ------------------------------------------------------------------------------------------------------
// NOTES:
// 1. Login page MUST implement this Route
// 2. The page we need to be protected MUST also implement this Route
// ------------------------------------------------------------------------------------------------------

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// ------------------------------------------------------------------------------------------------------

// Wrap the component and check if need authentication or not
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const RequireLoginComponent = (props) => {
  console.info('RequireLoginComponent components => props: ', props);

  const { auth: { isAuthenticated }, component: Component, ...rest } = props;

  const loginPath = '/login';
  const isOnLoginPath = props.location.pathname === loginPath;

  // Authenticated
  if (isAuthenticated) {
    // Check if we are on Login path
    if (isOnLoginPath) {
      // then redirect to Referrer
      const from = props.location.state ? props.location.state.from : { pathname: '/' };
      return (<Redirect to={from} />);
    }
    // otherwise will render Referrer page
    return (<Component {...rest} />);
  }

  // NOT Authenticated

  // if is on login page, will render the page
  if (isOnLoginPath) {
    return (<Component {...rest} />);
  }
  // otherwise redirect to login
  return (<Redirect to={{ pathname: loginPath, state: { from: props.location } }} />);
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

const RequireLogin = withRouter(connect(mapStateToProps)(RequireLoginComponent));

// ------------------------------------------------------------------------------------------------------

// Wrap the route that require authentication
export default (props) => {
  const { component: Component, ...rest } = props;  // MUST extract component out of the ...rest, so that passing the ...rest to Route will be OK
  return (
    <Route {...rest} component={() => (<RequireLogin {...props} />)} />
  )
}
