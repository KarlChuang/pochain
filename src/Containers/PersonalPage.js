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
    for (let i = 0; i < res.orders.length; i += 1) {
      const { txId } = res.orders[i];
      // console.log(txId);
      const txDetail = await this.props.pochainContract.methods.gettx(txId).call({ from: this.props.account });
      const txalive = await this.props.pochainContract.methods.txalive(txId).call({ from: this.props.account });
      const { 1: { _hex: amountHex } } = txDetail;
      const amount = parseInt(amountHex, 16);
      res.orders[i].amount = amount;
      res.orders[i].txalive = txalive;
    }
    this.setState({
      products: res.products,
      orders: res.orders,
      status: 'finish',
    });
  }
  async handleProductDelete(productId) {
    const account = await this.props.detectAccountChange();
    console.log(productId);
    this.props.handleAlert('Delete the Product?', async () => {
      this.props.pochainContract.methods
        .deleteProduct(productId)
        .send({ from: account });
      this.props.handleAlert('Waiting for blockchain mining...', () => {
        window.location.reload();
      });
    });
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
  detectAccountChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  pochainContract: PropTypes.shape({
    methods: PropTypes.shape({
      createproduct: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  handleAlert: PropTypes.func.isRequired,
};


export default PersonalPage;
