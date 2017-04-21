import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, } from 'react-bootstrap';

import ProductDetail from '../ProductDetail';

export default class Product extends React.Component {
  render() {
    console.info('Product components => props: ', this.props);
    const productId = this.props.productId || (this.props.match && this.props.match.params.productId) || null;
    return (
      <Grid>
        <h1>Products page</h1>
        <ul>
          <li><Link to="/product/1">Product 1 details</Link></li>
          <li><Link to="/product/2">Product 2 details</Link></li>
        </ul>
        <h2>This is product details page embbeded in Products page</h2>
        <ProductDetail productId={productId} className={productId ? '' : 'hide'} />
      </Grid>
    );
  }
}