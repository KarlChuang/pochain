import React from 'react';
import styled from 'styled-components';

import Product from './Product';

const Wrapper = styled.div`
  width: inherit;
  /* text-align: center; */
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding-top: 130px;
  padding-bottom: 50px;
  align-items: center;
`;

const SplitLine = styled.hr`
  width: 40%;
  transform: ${({ right }) => (right ? 'rotate(5deg)' : 'rotate(-5deg)')};
  margin-top: 1em;
  margin-bottom: 1em;
  opacity: .6;
  position: relative;
  background-color: #9E9E9E;
  height: 0.2px;
`;

const ProductList = () => (
  <Wrapper>
    <Product name="Apple" producer="Karl" deadline={Date.now()} detail="TTTT" />
    <SplitLine right />
    <Product name="Apple" producer="Karl" deadline={Date.now()} detail="TTTT" />
    <SplitLine />
    <Product name="Apple" producer="Karl" deadline={Date.now()} detail="TTTT" />
  </Wrapper>
);

export default ProductList;
