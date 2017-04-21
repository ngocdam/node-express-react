import React from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Navbar, Jumbotron } from 'react-bootstrap';

import './front.default.layout.css';

class Header extends React.Component {
  render() {
    return (
      <Navbar inverse fixedTop>
        <Grid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">React App</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <div className="pull-right">
            <NavLink className="menu-item" activeClassName="selected-menu-item" to="/" exact>Home</NavLink>
            <NavLink className="menu-item" activeClassName="selected-menu-item" to="/product">Products</NavLink>
            <NavLink className="menu-item" activeClassName="selected-menu-item" to="/login">Login</NavLink>
            <NavLink className="menu-item" activeClassName="selected-menu-item" to="/profile">Profile</NavLink>
          </div>
        </Grid>
      </Navbar >
    )
  }
}

class Footer extends React.Component {
  render() {
    return (
      <Grid>
        <p>© 2017 Company, Inc.</p>
      </Grid>
    )
  }
}

export default class DefaultLayout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Jumbotron>
          {this.props.children}
        </Jumbotron>
        <Footer />
      </div>
    )
  }
}
