import React from 'react';
import { Switch } from 'react-router-dom';

import DefaultRoute from './default.route';
import AuthRoute from './auth.route';

import { FrontLayouts } from '../components/Layouts';

export default (props) => {
  return (
    <Switch>
      <DefaultRoute exact path="/" component={FrontLayouts.Home} />
      <DefaultRoute exact path="/product" component={FrontLayouts.Product} />
      <DefaultRoute exact path="/product/:productId" component={FrontLayouts.Product} />
      {/*<DefaultRoute exact path="/product/:productId" component={FrontLayouts.ProductDetail} />*/}
      <AuthRoute path="/login" component={FrontLayouts.Login} />
      <AuthRoute path="/profile" component={FrontLayouts.Profile} />
      <DefaultRoute component={FrontLayouts.NotFound} />
    </Switch>
  );
};
