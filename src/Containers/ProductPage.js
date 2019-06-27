import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { hashProduct } from '../util/utils';
import ProductPageComponent from '../Components/ProductPage/ProductPage';
import { Waiting } from '../Components/WaitingPage/Waiting';

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: parseInt(this.props.location.pathname.split('/')[2], 10),
      blockchainId: -1,
      txId: -1,
      name: '',
      producer: '',
      deadline: '',
      description: '',
      price: 0,
      baseline: 0,
      images: [],
      imagePtr: -1,
      amount: 0,
      status: 'loading',
    };
    this.handlePreOrder = this.handlePreOrder.bind(this);
    this.checkProductHash = this.checkProductHash.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  async componentDidMount() {
    let res = await fetch(`/api/product/${this.state.id}`);
    res = await res.json();
    // create images
    res.images = res.images.map((obj) => {
      const image = btoa(String.fromCharCode.apply(null, obj.image.data));
      return `data:image/png;base64,${image}`;
    });

    // TODO: Fetch order numbers from the blockchain
    let amount = 0;
    let txId = -1;
    let orderRes = await fetch(`/api/order/${res.blockchainId}/${this.props.account}`);
    orderRes = await orderRes.json();
    if (orderRes.length > 0) {
      txId = orderRes[0].id;
      const txDetail = await this.props.pochainContract.methods.gettx(txId).call({ from: this.props.account });
      const {
        1: { _hex: amountHex },
      } = txDetail;
      amount = parseInt(amountHex, 16);
    }
    this.setState({
      ...res,
      imagePtr: (res.images.length > 0) ? 0 : -1,
      amount,
      txId,
    });
    if (this.checkProductHash()) {
      this.setState({
        status: 'finish',
      });
    } else {
      this.props.handleAlert('Product hash error...');
    }
  }

  async checkProductHash() {
    const productHash = hashProduct(this.state);
    const { blockchainId } = this.state;
    const productDetail = await this.props.pochainContract.methods.getproduct(blockchainId).call({ from: this.props.account });
    return (productDetail[0] === productHash);
  }

  async handlePreOrder() {
    const account = await this.props.detectAccountChange();
    if (await this.checkProductHash()) {
      const { amount, blockchainId, price, txId } = this.state;
      const productHash = hashProduct(this.state);

      if (txId === -1 || !await this.props.pochainContract.methods.txalive(txId).call({ from: this.props.account })) {
        // TODO: fulfill the ordering function
        this.props.pochainContract.methods
          .CreateTx(blockchainId, amount, productHash)
          .send({ from: account, value: this.props.web3.utils.toWei(((price * amount) + 2).toString(), 'finney') });
      } else {
        this.props.pochainContract.methods
          .EditTx(blockchainId, txId, amount, productHash)
          .send({ from: account, value: this.props.web3.utils.toWei(((price * amount) + 2).toString(), 'finney') });
      }
    } else {
      this.props.handleAlert('Product hash error...');
    }
  }

  async handleConfirm() {
    // TODO: handle confirm for product getting
    const account = await this.props.detectAccountChange();
    const { blockchainId, txId } = this.state;
    this.props.handleAlert('Confirm', () => {
      console.log('confirm');
      this.props.pochainContract.methods
        .CustomerRCVed(blockchainId, txId)
        .send({ from: account });
    });
  }

  render() {
    const { status } = this.state;
    if (status === 'loading') {
      return (<Waiting />);
    }
    return (
      <ProductPageComponent
        account={this.props.account}
        topState={this.state}
        handleImgRightClick={() => this.setState(({ imagePtr, images }) =>
          ((imagePtr < images.length - 1) ? ({ imagePtr: imagePtr + 1 }) : ({})))
        }
        handleImgLeftClick={() => this.setState(({ imagePtr }) =>
          ((imagePtr > 0) ? ({ imagePtr: imagePtr - 1 }) : ({})))
        }
        handleAmountChange={e => this.setState({ amount: parseInt(e.target.value, 10) })}
        handlePreOrder={this.handlePreOrder}
        handleConfirm={this.handleConfirm}
      />
    );
  }
}

ProductPage.propTypes = {
  account: PropTypes.string.isRequired,
  detectAccountChange: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  pochainContract: PropTypes.shape({
    methods: PropTypes.shape({
      CreateTx: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  web3: PropTypes.shape({
    utils: PropTypes.shape({
      toWei: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  handleAlert: PropTypes.func.isRequired,
};

const ProductPageRouter = withRouter(props => <ProductPage {...props} />);

export default ProductPageRouter;
