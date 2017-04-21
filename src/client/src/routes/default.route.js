import React from 'react';
import { Route } from 'react-router-dom';

// ------------------------------------------------------------------------------------------------------

// Wrap default route that not require authentication
export default ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (<Component {...props} />)} />
  )
};
