import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

import ProductList from '../Components/DefaultPage/ProductList';
import { Waiting } from '../Components/WaitingPage/Waiting';

class DefaultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      status: 'loading',
    };
  }
  async componentDidMount() {
    let res = await fetch('/api/all_products');
    res = await res.json();
    this.setState({
      products: res,
      status: 'finished',
    });
  }
  render() {
    const { products, status } = this.state;
    if (status === 'loading') {
      return (<Waiting />);
    }
    return (<ProductList products={products} />);
  }
}

export default DefaultPage;
