import React, { Component } from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';

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
  transform: ${({ right }) => (right ? 'rotate(2deg)' : 'rotate(-2deg)')};
  margin-top: 1em;
  margin-bottom: 1em;
  opacity: .6;
  position: relative;
  background-color: #9E9E9E;
  height: 0.2px;
`;

const ProductBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  async componentDidMount() {
    let res = await fetch('/api/all_product');
    res = await res.json();
    this.setState({
      products: res,
    });
  }
  render() {
    const { products } = this.state;
    return (
      <Wrapper>
        {
          products.map(({
            deadline,
            description,
            id,
            name,
            producer,
          }, idx) => (
            <ProductBlock key={id}>
              <Product
                name={name}
                producer={producer}
                deadline={new Date(deadline).getTime()}
                detail={description}
                id={id}
              />
              {(idx % 2 === 0) ? (<SplitLine right />) : (<SplitLine />)}
            </ProductBlock>
          ))
        }
      </Wrapper>
    );
  }
}

export default ProductList;
