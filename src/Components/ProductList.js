import React, { Component } from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';

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

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  async componentDidMount() {
    let res = await fetch('/api/all_products');
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
            image,
          }, idx) => (
            <ProductBlock key={id}>
              <Product
                name={name}
                producer={producer}
                deadline={new Date(deadline).getTime()}
                detail={description}
                id={id}
                image={(image === undefined) ?
                  '' : btoa(String.fromCharCode.apply(null, image.image.data))}
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
