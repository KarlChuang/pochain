import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route } from 'react-router-dom';

import Topbar from './Topbar';
import ProductList from './ProductList';
import Porpose from './Propose';
import Login from './Login';
import ProductPage from './ProductPage';

const Rootwrapper = styled.div`
  width: inherit;
  height: inherit;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Root = () => (
  <BrowserRouter>
    <Rootwrapper>
      <Topbar />
      <Route path="/" exact component={ProductList} />
      <Route path="/product" component={ProductPage} />
      <Route path="/propose" component={Porpose} />
      <Route path="/login" component={Login} />
    </Rootwrapper>
  </BrowserRouter>
);

export default Root;
