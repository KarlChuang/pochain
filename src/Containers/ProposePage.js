import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Propose from '../Components/ProposePage/Propose';
import { Waiting } from '../Components/WaitingPage/Waiting';
import { hashProduct, toLocalDateString } from '../util/utils';

class ProposePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: -1,
      productName: '',
      productDeadline: '',
      productPrice: '',
      blockchainId: -1,
      productBaseline: '',
      productDescription: '',
      productImg: {
        files: [],
        urls: [],
      },
      status: 'loading',
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleImgAdd = this.handleImgAdd.bind(this);
    this.handleImgDelete = this.handleImgDelete.bind(this);
  }

  async componentDidMount() {
    const { location, account } = this.props;
    const productId = location.pathname.split('/')[2];
    if (productId.length > 0) {
      let fileResponse = await fetch(`/api/product_propose/${productId}`);
      fileResponse = await fileResponse.json();
      // check producer
      if (fileResponse.producer !== account) {
        this.props.handleAlert('You are not the producer');
        window.location.replace('/user/');
      } else {
        const productImg = {
          files: fileResponse.images.map(({ id }) => id),
          urls: fileResponse.images.map(({ image }) => {
            const imageStr = btoa(String.fromCharCode.apply(null, image.data));
            return `data:image/png;base64,${imageStr}`;
          }),
        };

        this.setState({
          productName: fileResponse.name,
          productDeadline: toLocalDateString(fileResponse.deadline),
          productDescription: fileResponse.description,
          productPrice: fileResponse.price.toString(),
          productBaseline: fileResponse.baseline.toString(),
          productImg,
          productId: parseInt(productId, 10),
          blockchainId: parseInt(fileResponse.blockchainId, 10),
        });
      }
    }
    this.setState({ status: 'finish' });
  }

  handleImgAdd(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        productImg: {
          files: [...this.state.productImg.files, file],
          urls: [...this.state.productImg.urls, reader.result],
        },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  handleImgDelete(e) {
    const arr = [...this.state.productImg.urls];
    const files = [...this.state.productImg.files];
    const index = arr.indexOf(e.target.src);
    if (index !== -1) {
      arr.splice(index, 1);
      files.splice(index, 1);
      this.setState({
        productImg: {
          urls: arr,
          files,
        },
      });
    }
  }

  async handleSave() {
    let err = false;
    const account = await this.props.detectAccountChange();
    const {
      productId, productName, productDeadline, productDescription,
      productPrice, productBaseline, productImg,
    } = this.state;
    if (this.props.account === 'LOGIN' || this.props.account === '' || this.props.account === undefined) {
      this.props.handleAlert('Account error, please login to MetaMask again');
      err = true;
    } else if (productName === '') {
      this.props.handleAlert('Product name cannot be blank');
      err = true;
    } else if (productDeadline === '') {
      this.props.handleAlert('Product deadline cannot be blank');
      err = true;
    } else if (productBaseline === '') {
      this.props.handleAlert('Product baseline cannot be blank');
      err = true;
    } else if (productPrice === '') {
      this.props.handleAlert('Product price cannot be blank');
      err = true;
    } else if (new Date(productDeadline).getTime() <= Date.now()) {
      this.props.handleAlert('Product deadline should be a future time point');
      err = true;
    } else {
      // hash the product
      const hash = hashProduct({
        name: productName,
        deadline: productDeadline,
        description: productDescription,
        price: parseInt(productPrice, 10),
        producer: account,
        baseline: productBaseline,
        images: productImg.urls,
      });

      // create form
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('productName', productName);
      formData.append('productDeadline', productDeadline);
      formData.append('productDescription', productDescription);
      formData.append('productPrice', productPrice);
      formData.append('producer', account);
      formData.append('productBaseline', productBaseline);
      formData.append('hash', hash);
      productImg.files.forEach(file => formData.append('image', file));

      const res = await fetch('/api/new-product', {
        method: 'POST',
        body: formData,
      });
      const fetchRes = await res.json();
      if (fetchRes.message === 'success') {
        this.setState({
          productId: parseInt(fetchRes.id, 10),
          productImg: {
            ...this.state.productImg,
            files: fetchRes.imgIds,
          },
        });
        this.props.handleAlert('Save to the server!');
      } else {
        this.props.handleAlert(fetchRes.message);
        err = true;
      }
    }
    return err;
  }

  async handleCommit() {
    const err = await this.handleSave();
    if (!err) {
      const account = await this.props.detectAccountChange();
      const {
        productName, productDeadline, productDescription,
        productPrice, productBaseline, productImg, blockchainId,
      } = this.state;
      const hash = hashProduct({
        name: productName,
        deadline: productDeadline,
        description: productDescription,
        price: parseInt(productPrice, 10),
        producer: account,
        baseline: productBaseline,
        images: productImg.urls,
      });

      // TODO: save to blockchain (Solved)
      const timestamp = new Date(productDeadline).getTime() / 1000;
      const baseline = parseInt(productBaseline, 10);
      if (blockchainId === -1) {
        this.props.pochainContract.methods
          .createproduct(hash, parseInt(productPrice, 10), baseline, timestamp)
          .send({ from: account, value: this.props.web3.utils.toWei(((baseline * 3) + 2).toString(), 'finney') });
      } else {
        // TODO: change the product on blockchain (solved)
        this.props.pochainContract.methods
          .editproduct(blockchainId, hash, parseInt(productPrice, 10), baseline, timestamp)
          .send({ from: account, value: this.props.web3.utils.toWei(((baseline * 3) + 2).toString(), 'finney') });
      }
    }
  }

  render() {
    if (this.state.status === 'loading') {
      return (<Waiting />);
    }
    return (
      <Propose
        topState={this.state}
        handleTitleChange={e => this.setState({ productName: e.target.value })}
        handleDescriptionChange={e => this.setState({ productDescription: e.target.value })}
        handleDateChange={e => this.setState({ productDeadline: e.target.value })}
        handlePriceChange={e => this.setState({ productPrice: e.target.value })}
        handleBaselineChange={e => this.setState({ productBaseline: e.target.value })}
        handleSave={this.handleSave}
        handleCommit={this.handleCommit}
        handleImgAdd={this.handleImgAdd}
        handleImgDelete={this.handleImgDelete}
      />
    );
  }
}

ProposePage.propTypes = {
  detectAccountChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
  pochainContract: PropTypes.shape({
    methods: PropTypes.shape({
      createproduct: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  handleAlert: PropTypes.func.isRequired,
};

const ProposeRouter = withRouter(props => <ProposePage {...props} />);

export default ProposeRouter;
