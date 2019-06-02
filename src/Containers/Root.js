import React, { Component } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import { Waiting, Alert } from '../Components/WaitingPage/Waiting';
import Router from '../Components/Router';

import pdContractJson from '../../build/contracts/product.json';
import txContractJson from '../../build/contracts/tx.json';
import smConfig from '../../config/smartContract';

const Rootwrapper = styled.div`
  width: inherit;
  height: inherit;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
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
      alertMsg: '',
      handleAlertBack: () => console.log('back'),
      handleAlertOK: () => console.log('ok'),
    };
    this.detectAccountChange = this.detectAccountChange.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.handleAlertBack = this.handleAlertBack.bind(this);
    this.handleAlertOK = this.handleAlertOK.bind(this);
  }

  async componentDidMount() {
    // initial web3 and detect MetaMask
    let web3js;
    if (window.ethereum) {
      web3js = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        this.handleAlert('Unexpected error');
      }
    } else if (window.web3) {
      web3js = Web3(window.web3.currentProvider);
    } else {
      const alertMsg = 'Non-Ethereum browser detected. You should consider trying MetaMask!';
      this.handleAlert(alertMsg);
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

  handleAlert(alertMsg, handleOK = () => { }, handleBack = () => { }) {
    this.setState({
      status: 'alert',
      alertMsg,
      handleAlertBack: handleBack,
      handleAlertOK: handleOK,
    });
  }

  async handleAlertBack() {
    const func = this.state.handleAlertBack();
    this.setState({
      status: 'finish',
      alertMsg: '',
      handleAlertBack: () => console.log('alert'),
      handleAlertOK: () => console.log('ok'),
    });
    await func();
  }

  async handleAlertOK() {
    const func = this.state.handleAlertOK;
    this.setState({
      status: 'finish',
      alertMsg: '',
      handleAlertBack: () => console.log('alert'),
      handleAlertOK: () => console.log('ok'),
    });
    await func();
  }

  render() {
    const {
      account,
      productContract,
      txContract,
      web3,
      status,
      alertMsg,
    } = this.state;
    if (status === 'loading') {
      return (<Waiting />);
    }
    return (
      <Rootwrapper>
        {
          (status === 'alert') ? (
            <Alert
              message={alertMsg}
              handleBack={this.handleAlertBack}
              handleOK={this.handleAlertOK}
            />
          ) : ('')
        }
        <Router
          account={account}
          productContract={productContract}
          txContract={txContract}
          web3={web3}
          detectAccountChange={this.detectAccountChange}
          handleAlert={this.handleAlert}
        />
      </Rootwrapper>
    );
  }
}

export default Root;
