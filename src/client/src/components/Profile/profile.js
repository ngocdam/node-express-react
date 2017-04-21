import React from 'react';
import { Grid, Button } from 'react-bootstrap';

export default class Profile extends React.Component {

  signout = () => {
    this.props.signout();
  }

  render() {
    console.info('Profile components => props: ', this.props);

    return (
      <Grid>
        <h1>Welcome to React</h1>
        <p>
          Profile page
        </p>
        <Button bsStyle="success" onClick={this.signout}>Signout</Button>
      </Grid>
    );
  }

}