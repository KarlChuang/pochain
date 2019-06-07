import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Personal from '../Components/PersonalPage/Personal';
import { Waiting } from '../Components/WaitingPage/Waiting';

class PersonalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      orders: [],
      status: 'loading',
    };
    this.handleProductDelete = this.handleProductDelete.bind(this);
  }
  async componentDidMount() {
    let res = await fetch(`/api/user/${this.props.account}`);
    res = await res.json();
    this.setState({
      products: res.products,
      orders: res.orders,
      status: 'finish',
    });
  }
  async handleProductDelete(productId) {
    this.props.handleAlert('Delete the Product?', async () => {
      // Use blockchain to delete product
      // after server detect blockchain event, delete product from database
      // let res = await fetch('/api/delete-product', {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     productId,
      //   }),
      // });
      // res = await res.text();
      // if (res === 'success') {
      this.props.handleAlert('Waiting for blockchain mining...');
      // this.setState({
      //   products: this.state.products.filter(({ id }) => id !== productId),
      //   orders: this.state.orders.filter(({ id }) => id !== productId),
      // });
      // } else {
      //   alert('Unexpected error');
      // }
    });
    // window.location.replace('/user/');
  }
  render() {
    if (this.state.status === 'loading') {
      return (<Waiting />);
    }
    return (
      <Personal
        topState={this.state}
        handleProductDelete={this.handleProductDelete}
      />
    );
  }
}

PersonalPage.propTypes = {
  // detectAccountChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  pochainContract: PropTypes.shape({
    methods: PropTypes.shape({
      createproduct: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  handleAlert: PropTypes.func.isRequired,
};


export default PersonalPage;
