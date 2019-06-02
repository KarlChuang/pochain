import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Product from './Product';

const Wrapper = styled.div`
  width: 100%;
  /* text-align: center; */
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding-top: 130px;
  padding-bottom: 50px;
  align-items: center;
  overflow: scroll;
  height: 100%;
`;

const SplitLine = styled.hr`
  width: 40%;
  transform: ${({ right }) => (right ? 'rotate(2deg)' : 'rotate(-2deg)')};
  margin-top: 1em;
  margin-bottom: 1em;
  opacity: .6;
  position: relative;
  background-color: #9E9E9E;
  height: 0.2px;
`;

const ProductBlock = styled.div`
  width: 70%;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
  flex-shrink: 0;
`;

const ProductWrapper = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: black;
  position: relative;
`;

const ProductIconBlock = styled.div`
  height: 100%;
  position: absolute;
  cursor: pointer;
  transition: .3s;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  width: 100%;
`;

const ProductIcon = styled.i`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 50px;
  cursor: pointer;
  border-radius: 10px;
  background-color: #00000077;
  color: #ffffffaa;
`;

const ProductList = ({ products }) => (
  <Wrapper>
    {
      products.map(({
        deadline,
        description,
        id,
        name,
        producer,
        image,
      }, idx) => (
        <ProductBlock key={id}>
          <ProductWrapper>
            {
              (new Date(deadline).getTime() <= new Date().getTime()) ? (
                <ProductIconBlock>
                  <ProductIcon>Time Expired... Manufacturing</ProductIcon>
                </ProductIconBlock>
              ) : ''
            }
            <Product
              name={name}
              producer={producer}
              deadline={new Date(deadline).getTime()}
              detail={description}
              id={id}
              image={(image === undefined) ?
                '' : btoa(String.fromCharCode.apply(null, image.image.data))}
            />
          </ProductWrapper>
          {(idx % 2 === 0) ? (<SplitLine right />) : (<SplitLine />)}
        </ProductBlock>
      ))
    }
  </Wrapper>
);

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    blockchainId: PropTypes.number.isRequired,
    deadline: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    producer: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
      }).isRequired,
      product_id: PropTypes.number.isRequired,
    }).isRequired,
  })).isRequired,
};

export default ProductList;
