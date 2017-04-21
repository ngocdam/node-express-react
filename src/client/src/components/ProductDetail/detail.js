import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, } from 'react-bootstrap';

export default class ProductDetail extends React.Component {
  render() {
    console.info('ProductDetail components => props: ', this.props);
    const productId = this.props.productId || (this.props.match && this.props.match.params.productId) || null;
    if (!productId) {
      return (
        <span>Product not found</span>
      );
    }
    return (
      <Grid>
        <h1>Product details page</h1>
        <ul>
          <li><Link to="/product">Back to Products</Link></li>
        </ul>
        <p>Product ID = {productId}</p>
      </Grid>
    );
  }
}
