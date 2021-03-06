import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { toLocalDateString } from '../../util/utils';

const Productwrapper = styled(Link)`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: black;
`;

const ProductImgBox = styled.div`
  width: 250px;
  height: 250px;
  margin: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-radius: 15px;
  background-color: black;
  flex-shrink: 0;
`;

const ProductImg = styled.img`
  width: 100%;
`;

const ProductDiscription = styled.div`
  flex-grow: 1;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
  margin-left: 30px;
  overflow: hidden;
`;

const ProductName = styled.div`
  width: 100%;
  height: 50px;
  font-size: 33px;
  font-family: 'Righteous', cursive;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
`;

const ProductOwner = styled.div`
  width: 100%;
  margin-top: 5px;
  color: #949494;
  height: 22px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-shrink: 0;
`;

const ProductDetail = styled.div`
  width: 100%;
  flex-grow: 1;
  margin-top: 10px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
  overflow: scroll;
  white-space: pre-wrap;
`;

const ProductList = ({
  id,
  name,
  producer,
  deadline,
  detail,
  image,
}) => (
  <Productwrapper to={`/product/${id}`}>
    <ProductImgBox>
      {
        (image === '') ? (
          <ProductImg />
        ) : (
          <ProductImg src={`data:image/png;base64,${image}`} />
        )
      }
    </ProductImgBox>
    <ProductDiscription>
      <ProductName>{name}</ProductName>
      <ProductOwner>Producer: {producer}</ProductOwner>
      <ProductOwner>Deadline: {toLocalDateString(deadline)}</ProductOwner>
      <ProductDetail>{detail}</ProductDetail>
    </ProductDiscription>
  </Productwrapper>
);

ProductList.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  producer: PropTypes.string.isRequired,
  deadline: PropTypes.number.isRequired,
  detail: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default ProductList;
