import React from 'react';
import { Grid, Button } from 'react-bootstrap';

export default class Home extends React.Component {
  render() {
    console.info('Home components => props: ', this.props);
    return (
      <Grid>
        <h1>Welcome to React</h1>
        <p>
          <Button
            bsStyle="success"
            bsSize="large"
            href="http://react-bootstrap.github.io/components.html"
            target="_blank">
            View React Bootstrap Docs
        </Button>
        </p>
      </Grid>
    );
  }
}