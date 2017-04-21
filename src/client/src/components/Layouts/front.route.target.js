import React from 'react';

import DefaultLayout from './front.default.layout';
import LoginLayout from './front.login.layout';

import NotFoundComponent from '../NotFound';
import HomeComponent from '../Home';
import ProductComponent from '../Product';
import ProductDetailComponent from '../ProductDetail';
import LoginComponent from '../Login';
import ProfileComponent from '../Profile';

// ------------------------------------------------------------------------------------------------------

export const NotFound = (props) => {
  return (
    <DefaultLayout>
      <NotFoundComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Home = (props) => {
  return (
    <DefaultLayout>
      <HomeComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Product = (props) => {
  return (
    <DefaultLayout>
      <ProductComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const ProductDetail = (props) => {
  return (
    <DefaultLayout>
      <ProductDetailComponent />
    </DefaultLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Login = (props) => {
  return (
    <LoginLayout>
      <LoginComponent />
    </LoginLayout>
  );
};

// ------------------------------------------------------------------------------------------------------

export const Profile = (props) => {
  return (
    <DefaultLayout>
      <ProfileComponent />
    </DefaultLayout>
  );
};
