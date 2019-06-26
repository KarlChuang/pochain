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
  async handleProductDelete(blochchainId, productId) {
    const account = await this.props.detectAccountChange();
    this.props.handleAlert('Delete the Product?', async () => {
      if (blochchainId >= 0) {
        this.props.pochainContract.methods
          .deleteProduct(blochchainId)
          .send({ from: account })
          .on('confirmation', async () => {
            this.props.handleAlert('Product deleted from blockchain, you can delete again to delete from database', () => {
              window.location.reload();
            });
          });
      } else {
        const formData = new FormData();
        formData.append('productId', productId);
        let res = await fetch('/api/delete-product', {
          method: 'POST',
          body: formData,
        });
        res = await res.text();
        if (res === 'success') {
          this.props.handleAlert('Product deleted', () => {
            window.location.reload();
          });
        }
      }
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
