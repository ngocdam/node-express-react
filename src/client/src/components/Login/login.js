import React from 'react';
import { Grid, Button } from 'react-bootstrap';

export default class Login extends React.Component {

  login = () => {
    this.props.authenticate();
  }

  render() {
    console.info('Login component => props: ', this.props);

    const { location } = this.props;
    const from = location && location.state ? location.state.from : { pathname: '/' };

    return (
      <Grid>
        <p>You must log in to view the page at {from.pathname}</p>
        <Button bsStyle="success" onClick={this.login}>Log in</Button>
      </Grid>
    )
  }

}