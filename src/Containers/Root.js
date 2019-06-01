import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';
import Web3 from 'web3';

import DefaultPage from './DefaultPage';
import ProductPage from '../Containers/ProductPage';
import ProposePage from '../Containers/ProposePage';
import Login from '../Components/Topbar/Login';
import Topbar from '../Components/Topbar/Topbar';
import PersonalPage from './PersonalPage';
import { Waiting } from '../Components/WaitingPage/Waiting';

import pdContractJson from '../../build/contracts/product.json';
import txContractJson from '../../build/contracts/tx.json';
import smConfig from '../../config/smartContract';

const Rootwrapper = styled.div`
  width: inherit;
  height: inherit;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: undefined,
      account: 'LOGIN',
      productContract: undefined,
      txContract: undefined,
      status: 'loading',
    };
    this.detectAccountChange = this.detectAccountChange.bind(this);
  }

  async componentDidMount() {
    // initial web3 and detect MetaMask
    let web3js;
    if (window.ethereum) {
      web3js = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        alert('Unexpected error');
      }
    } else if (window.web3) {
      web3js = Web3(window.web3.currentProvider);
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

    if (web3js !== undefined) {
      // account detection and smart contract initialization
      const account = await web3js.eth.getAccounts();
      const productContract = new web3js.eth.Contract(pdContractJson.abi, smConfig.product);
      const txContract = new web3js.eth.Contract(txContractJson.abi, smConfig.tx);

      // setInterval for account detection
      setInterval(() => this.detectAccountChange(), 100);

      // update state
      this.setState({
        web3: web3js,
        account: account[0],
        productContract,
        txContract,
        status: 'finish',
      });
    }
  }

  async detectAccountChange() {
    // Return current account and upadate the state
    // If web3 is undefined, it will return undefined
    if (this.state.web3 !== undefined) {
      const account = await this.state.web3.eth.getAccounts();
      if (account[0] !== this.state.account) {
        this.setState({
          account: account[0],
        });
      }
      return account[0];
    }
    return undefined;
  }

  render() {
    const {
      account,
      productContract,
      txContract,
      web3,
      status,
    } = this.state;
    if (status === 'loading') {
      return (<Waiting />);
    }
    return (
      <BrowserRouter>
        <Rootwrapper>
          <Topbar account={account} />
          <Route path="/" exact component={() => <DefaultPage />} />
          <Route path="/product" component={() => <ProductPage account={account} detectAccountChange={this.detectAccountChange} txContract={txContract} web3={web3} />} />
          <Route path="/propose" component={() => <ProposePage account={account} detectAccountChange={this.detectAccountChange} productContract={productContract} />} />
          <Route path="/login" component={Login} />
          <Route path="/user" component={() => <PersonalPage account={account} detectAccountChange={this.detectAccountChange} productContract={productContract} />} />
        </Rootwrapper>
      </BrowserRouter>
    );
  }
}

export default Root;
