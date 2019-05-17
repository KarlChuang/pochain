import React, { Component } from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';

import { toLocalDateString } from '../util/utils';
import CommentList from './CommentList';

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

const ProductName = styled.div`
  width: 100%;
  height: 50px;
  font-size: 40px;
  font-family: 'Righteous', cursive;
`;

const ProductBrief = styled.div`
  width: 80%;
  height: 500px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProductImg = styled.img`
  width: 440px;
  min-width: 440px;
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

const ProductOwner = styled.div`
  width: 100%;
  margin-top: 5px;
  color: #949494;
  height: 22px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
`;

const ProductBriefDetail = styled.div`
  width: 100%;
  flex-grow: 1;
  margin-top: 10px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
`;

const SplitLine = styled.hr`
  width: 60%;
  transform: ${({ right }) => (right ? 'rotate(2deg)' : 'rotate(-2deg)')};
  margin-top: 0.3em;
  margin-bottom: 2em;
  opacity: .6;
  position: relative;
  background-color: #9E9E9E;
  height: 0.2px;
`;

const Buttons = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const Button = styled.button`
  background-color: #ededed;
  font-size: 18px;
  height: 35px;
  border: none;
  border-radius: 7px;
  font-family: 'Righteous', cursive;
  transition: .3s;
  :hover {
    background-color: #888888;
    color: #ededed;
    transition: .3s;
  }
`;

class ProductPage extends Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    console.log();
    this.state = {
      id: parseInt(location.pathname.split('/')[2], 10),
      name: '',
      producer: '',
      deadline: '',
      description: '',
      images: [],
    };
  }
  async componentDidMount() {
    let res = await fetch(`/api/product/${this.state.id}`);
    res = await res.json();
    let imgRes = await fetch(`/api/product_img/${this.state.id}`);
    imgRes = await imgRes.json();
    const images = [];
    for (let i = 0; i < imgRes.length; i += 1) {
      const image = btoa(String.fromCharCode.apply(null, imgRes[i].image.data));
      images.push(`data:image/png;base64,${image}`);
    }
    // console.log(imgRes);
    this.setState({
      ...res[0],
      images,
    });
  }
  render() {
    const {
      name,
      producer,
      deadline,
      description,
      images,
    } = this.state;
    return (
      <Wrapper>
        <ProductName>{name}</ProductName>
        <ProductBrief>
          <ProductImg src={images[0]} />
          <ProductDiscription>
            <ProductOwner>Producer: {producer}</ProductOwner>
            <ProductOwner>Deadline: {toLocalDateString(deadline)}</ProductOwner>
            <ProductBriefDetail>{description}</ProductBriefDetail>
            <Buttons>
              <Button>Pre-order</Button>
            </Buttons>
          </ProductDiscription>
        </ProductBrief>
        <SplitLine />
        <CommentList />
      </Wrapper>
    );
  }
}

const ProductPageRouter = withRouter(props => <ProductPage {...props} />);

export default ProductPageRouter;
