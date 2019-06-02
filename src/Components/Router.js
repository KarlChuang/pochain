import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import DefaultPage from '../Containers/DefaultPage';
import ProductPage from '../Containers/ProductPage';
import ProposePage from '../Containers/ProposePage';
import PersonalPage from '../Containers/PersonalPage';
import Login from './Topbar/Login';
import Topbar from './Topbar/Topbar';

const Rootwrapper = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

class Router extends Component {
  shouldComponentUpdate(prevProps) {
    const keys = Object.keys(prevProps);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (prevProps[key] !== this.props[key]) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {
      account,
      productContract,
      txContract,
      web3,
      detectAccountChange,
      handleAlert,
    } = this.props;
    return (
      <BrowserRouter>
        <Rootwrapper>
          <Topbar account={account} />
          <Route path="/" exact component={() => <DefaultPage />} />
          <Route
            path="/product"
            component={() => (
              <ProductPage
                account={account}
                detectAccountChange={detectAccountChange}
                txContract={txContract}
                web3={web3}
                handleAlert={handleAlert}
              />
            )}
          />
          <Route
            path="/propose"
            component={() => (
              <ProposePage
                account={account}
                detectAccountChange={detectAccountChange}
                productContract={productContract}
                handleAlert={handleAlert}
              />
            )}
          />
          <Route path="/login" component={Login} />
          <Route
            path="/user"
            component={() => (
              <PersonalPage
                account={account}
                detectAccountChange={detectAccountChange}
                productContract={productContract}
                handleAlert={handleAlert}
              />
            )}
          />
        </Rootwrapper>
      </BrowserRouter>
    );
  }
}

Router.propTypes = {
  account: PropTypes.string.isRequired,
  txContract: PropTypes.shape({
    methods: PropTypes.shape({
      CreateTx: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  web3: PropTypes.shape({
    utils: PropTypes.shape({
      toWei: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  productContract: PropTypes.shape({
    methods: PropTypes.shape({
      createproduct: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  detectAccountChange: PropTypes.func.isRequired,
  handleAlert: PropTypes.func.isRequired,
};

export default Router;
