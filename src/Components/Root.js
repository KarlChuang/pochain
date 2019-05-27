import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';
import Web3 from 'web3';

import Topbar from './Topbar';
import ProductList from './ProductList';
import Porpose from './Propose';
import Login from './Login';
import ProductPage from './ProductPage';
import PersonalPage from './PersonalPage';

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
    };
    this.detectAccountChange = this.detectAccountChange.bind(this);
  }
  async componentDidMount() {
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
    const account = await web3js.eth.getAccounts();
    this.setState({
      web3: web3js,
      account: account[0],
    });
  }
  async detectAccountChange() {
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
    const { account } = this.state;
    return (
      <BrowserRouter>
        <Rootwrapper>
          <Topbar account={account} />
          <Route path="/" exact component={ProductList} />
          <Route path="/product" component={() => <ProductPage account={account} detectAccountChange={this.detectAccountChange} />} />
          <Route path="/propose" component={() => <Porpose account={account} detectAccountChange={this.detectAccountChange} />} />
          <Route path="/login" component={Login} />
          <Route path="/user" component={() => <PersonalPage account={account} detectAccountChange={this.detectAccountChange} />} />
        </Rootwrapper>
      </BrowserRouter>
    );
  }
}

export default Root;
