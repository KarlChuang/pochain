import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { toLocalDateString } from '../util/utils';

const Productwrapper = styled(Link)`
  width: 70%;
  height: 300px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: black;
`;

const ProductImg = styled.img`
  width: 250px;
  height: 250px;
  margin: 10px;
`;

const ProductDiscription = styled.div`
  flex-grow: 1;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
  margin-left: 30px;
`;

const ProductName = styled.div`
  width: 100%;
  height: 50px;
  font-size: 33px;
  font-family: 'Righteous', cursive;
`;

const ProductOwner = styled.div`
  width: 100%;
  margin-top: 5px;
  color: #949494;
  height: 22px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
`;

const ProductDetail = styled.div`
  width: 100%;
  flex-grow: 1;
  margin-top: 10px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
`;

const ProductList = ({
  name,
  producer,
  deadline,
  detail,
}) => (
  <Productwrapper to="/product">
    <ProductImg />
    <ProductDiscription>
      <ProductName>{name}</ProductName>
      <ProductOwner>Producer: {producer}</ProductOwner>
      <ProductOwner>Deadline: {toLocalDateString(deadline)}</ProductOwner>
      <ProductDetail>{detail}</ProductDetail>
    </ProductDiscription>
  </Productwrapper>
);

ProductList.propTypes = {
  name: PropTypes.string.isRequired,
  producer: PropTypes.string.isRequired,
  deadline: PropTypes.number.isRequired,
  detail: PropTypes.string.isRequired,
};

export default ProductList;
