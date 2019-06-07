import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Product from '../DefaultPage/Product';

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

const TopBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* padding-top: 130px; */
  /* padding-bottom: 50px; */
  align-items: center;
`;

const Line = styled.hr`
  width: 40%;
`;

const BlockTitle = styled.div`
  font-family: 'Righteous',cursive;
  font-size: 25px;
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
  position: relative;
`;

const Productwrapper = styled.div`
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

const ProductIconBlock = styled(Link)`
  height: 100%;
  position: absolute;
  cursor: pointer;
  transition: .3s;
  /* width: 50%; */
  display: flex;
  flex-direction: row;
  text-decoration: none;
  ${({ right }) => ((right) ? 'right: 0;' : 'left: 0;')}
  width: ${({ span }) => ((span) ? 100 : 50)}%;
`;

const ProductIcon = styled.i`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 80px;
  cursor: pointer;
  color: #ffffff00;
  background-color: #ffffff00;
  transition: .3s;
  border-radius: 10px;
  :hover {
    background-color: #00000077;
    color: #ffffffaa;
    transition: .3s;
  }
`;

const ProductIconNoHover = styled(ProductIcon)`
  background-color: #00000077;
  color: #ffffffaa;
`;

const Personal = ({
  topState: {
    products,
    orders,
  },
  handleProductDelete,
}) => (
  <Wrapper>
    <TopBlock>
      <BlockTitle>MY PRODUCTS</BlockTitle>
      <Line />
      {
        products.map(({
          deadline,
          description,
          id,
          name,
          producer,
          images,
          blockchainId,
        }, idx) => (
          <ProductBlock key={id}>
            <Productwrapper>
              <ProductIconBlock to={`/propose/${id}`}>
                <ProductIcon className="fas fa-edit" />
              </ProductIconBlock>
              <ProductIconBlock right={1} to="/user/" onClick={() => handleProductDelete(blockchainId)}>
                <ProductIcon className="fas fa-trash-alt" />
              </ProductIconBlock>
              <Product
                name={name}
                producer={producer}
                deadline={new Date(deadline).getTime()}
                detail={description}
                id={id}
                image={(images[0] === undefined) ?
                  '' : btoa(String.fromCharCode.apply(null, images[0].image.data))}
              />
            </Productwrapper>
            {(idx % 2 === 0) ? (<SplitLine right />) : (<SplitLine />)}
          </ProductBlock>
        ))
      }
    </TopBlock>
    <TopBlock>
      <BlockTitle>MY ORDERS</BlockTitle>
      <Line />
      {
        orders.map(({
          deadline,
          description,
          id,
          name,
          producer,
          images,
          amount,
          txalive,
        }, idx) => (
          <ProductBlock key={id}>
            <Productwrapper>
              <ProductIconBlock span={1} to={`/product/${id}`}>
                {
                  (txalive === true) ? (
                    <ProductIcon>{amount}</ProductIcon>
                  ) : (
                    <ProductIconNoHover>Product Updated!</ProductIconNoHover>
                  )
                }
              </ProductIconBlock>
              <Product
                name={name}
                producer={producer}
                deadline={new Date(deadline).getTime()}
                detail={description}
                id={id}
                image={(images[0] === undefined) ?
                  '' : btoa(String.fromCharCode.apply(null, images[0].image.data))}
              />
            </Productwrapper>
            {(idx % 2 === 0) ? (<SplitLine right />) : (<SplitLine />)}
          </ProductBlock>
        ))
      }
    </TopBlock>
  </Wrapper>
);

Personal.propTypes = {
  topState: PropTypes.shape({
    products: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      deadline: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      producer: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.number).isRequired,
        }).isRequired,
      })).isRequired,
    })).isRequired,
    orders: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      deadline: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      producer: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      txalive: PropTypes.bool.isRequired,
      images: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.number).isRequired,
        }).isRequired,
      })).isRequired,
    })).isRequired,
  }).isRequired,
  handleProductDelete: PropTypes.func.isRequired,
};

export default Personal;
