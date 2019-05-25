import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

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
  width: 50%;
  display: flex;
  flex-direction: row;
  text-decoration: none;
  ${({ right }) => ((right) ? 'right: 0;' : 'left: 0;')}
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

class PersonalPage extends Component {
  constructor(props) {
    super(props);
    const { detectAccountChange } = this.props;
    detectAccountChange();
    this.state = {
      products: [],
      orders: [],
    };
    this.handleProductDelete = this.handleProductDelete.bind(this);
  }
  async componentDidMount() {
    let res = await fetch(`/api/user/${this.props.account}`);
    res = await res.json();
    this.setState({
      products: res.products,
      orders: res.orders,
    });
  }
  async handleProductDelete(productId) {
    if (confirm('Delete the Product?')) {
      let res = await fetch('/api/delete-product', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
        }),
      });
      res = await res.text();
      console.log(res);
      if (res === 'success') {
        alert('Success');
        this.setState({
          products: this.state.products.filter(({ id }) => id !== productId),
        });
      } else {
        alert('Unexpected error');
      }
    } else {
      window.location.replace('/user/');
    }
  }
  render() {
    const { products, orders } = this.state;
    return (
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
            }, idx) => (
              <ProductBlock key={id}>
                <Productwrapper>
                  <ProductIconBlock to={`/propose/${id}`}>
                    <ProductIcon className="fas fa-edit" />
                  </ProductIconBlock>
                  <ProductIconBlock right={1} to={`/user/${producer}`} onClick={() => this.handleProductDelete(id)}>
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
            }, idx) => (
              <ProductBlock key={id}>
                <Productwrapper>
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
  }
}

PersonalPage.propTypes = {
  detectAccountChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
};

export default PersonalPage;
