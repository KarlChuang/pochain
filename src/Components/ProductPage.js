import React, { Component } from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';
import { withRouter, Link } from 'react-router-dom';
import sha256 from 'js-sha256';

import { toLocalDateString } from '../util/utils';
import CommentList from './CommentList';

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
`;

const ProductName = styled.div`
  width: 100%;
  height: 50px;
  font-size: 40px;
  font-family: 'Righteous', cursive;
  flex-shrink: 0;
`;

const ProductBrief = styled.div`
  width: 80%;
  height: 500px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const ProductBox = styled.div`
  width: 440px;
  height: 440px;
  margin: 10px;
  display: flex;
  align-items: center;
  position: relative;
  background-color: black;
  justify-content: space-around;
  border-radius: 25px;
  overflow: hidden;
  flex-shrink: 0;
`;

const ImgIcon = styled.i`
  position: absolute;
  color: white;
  font-size: 80px;
  cursor: pointer;
  color: #ffffff3b;
  height: 100%;
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  transition: .3s;
  ${({ right }) => ((right) ? 'right: 0;' : 'left: 0;')}
  :hover {
    background-color: #00000063;
    color: #ffffffcf;
    transition: .3s;
  }
`;

const ProductImg = styled.img`
  /* max-width: 440px; */
  width: 100%;
  height: auto;
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

const ProductBriefDetail = styled.div`
  width: 100%;
  flex-grow: 1;
  margin-top: 10px;
  font-size: 20px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1px;
  white-space: pre-wrap;
  overflow: scroll;
  position: relative;
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
  flex-shrink: 0;
`;

const Buttons = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  flex-shrink: 0;
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

const AmountBox = styled.div`
  height: 35px;
`;

const AmountInput = styled.input`
  margin-right: 10px;
  height: 27px;
  width: 40px;
  border: 1px;
  border-style: solid;
  border-radius: 5px;
`;

const ButtonLink = styled(Link)`
  background-color: #ededed;
  font-size: 18px;
  height: 35px;
  border: none;
  border-radius: 7px;
  font-family: 'Righteous', cursive;
  transition: .3s;
  text-decoration: none;
  color: black;
  padding: 1px 7px 2px;
  align-items: center;
  display: flex;
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
    this.state = {
      id: parseInt(location.pathname.split('/')[2], 10),
      name: '',
      producer: '',
      deadline: '',
      description: '',
      images: [],
      imagePtr: -1,
      amount: 0,
    };
    this.handleImgRightClick = this.handleImgRightClick.bind(this);
    this.handleImgLeftClick = this.handleImgLeftClick.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handlePreOrder = this.handlePreOrder.bind(this);
  }
  async componentDidMount() {
    const { detectAccountChange } = this.props;
    const account = await detectAccountChange();
    let res = await fetch(`/api/product/${this.state.id}`);
    res = await res.json();
    let imgRes = await fetch(`/api/product_img/${this.state.id}`);
    imgRes = await imgRes.json();
    let orderRes = await fetch(`/api/order/${this.state.id}/${account}`);
    orderRes = await orderRes.json();

    const images = [];
    for (let i = 0; i < imgRes.length; i += 1) {
      const image = btoa(String.fromCharCode.apply(null, imgRes[i].image.data));
      images.push(`data:image/png;base64,${image}`);
    }
    // console.log(imgRes);
    let imagePtr = -1;
    if (images.length > 0) {
      imagePtr = 0;
    }
    this.setState({
      ...res[0],
      images,
      imagePtr,
      amount: (orderRes.length > 0) ? orderRes[0].amount : 0,
    });

    // check hash
    console.log([
      res[0].name,
      res[0].deadline.split('T')[0],
      res[0].description,
      res[0].price,
      res[0].producer,
      images,
    ]);
    console.log(sha256([
      res[0].name,
      res[0].deadline.split('T')[0],
      res[0].description,
      res[0].price.toString(),
      res[0].producer,
      images,
    ]));
  }
  handleImgRightClick() {
    if (this.state.imagePtr < this.state.images.length - 1) {
      this.setState({
        imagePtr: this.state.imagePtr + 1,
      });
    }
  }
  handleImgLeftClick() {
    if (this.state.imagePtr > 0) {
      this.setState({
        imagePtr: this.state.imagePtr - 1,
      });
    }
  }
  handleAmountChange(e) {
    this.setState({
      amount: e.target.value,
    });
  }
  async handlePreOrder() {
    const account = await this.props.detectAccountChange();
    const { amount, id } = this.state;
    const res = await fetch('/api/pre-order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        amount,
        account,
      }),
    });
    const message = await res.text();
    if (message === 'success') {
      alert('Pre-order success');
    } else {
      alert(message);
    }
  }
  render() {
    const {
      id,
      name,
      producer,
      deadline,
      description,
      images,
      imagePtr,
      amount,
    } = this.state;
    return (
      <Wrapper>
        <ProductName>{name}</ProductName>
        <ProductBrief>
          <ProductBox>
            <ImgIcon onClick={this.handleImgLeftClick} className="fas fa-chevron-left" />
            <ImgIcon onClick={this.handleImgRightClick} right className="fas fa-chevron-right" />
            <ProductImg src={images[imagePtr]} />
          </ProductBox>
          <ProductDiscription>
            <ProductOwner>{`Producer: ${producer}`}</ProductOwner>
            <ProductOwner>{`Deadline: ${toLocalDateString(deadline)}`}</ProductOwner>
            <ProductBriefDetail>{description}</ProductBriefDetail>
            <Buttons>
              <AmountBox>
                <AmountInput type="number" min="0" value={amount} onChange={this.handleAmountChange} />
                <Button onClick={this.handlePreOrder}>Pre-order</Button>
              </AmountBox>
              {
                (this.props.account === producer) ? (
                  <ButtonLink to={`/propose/${id}`}>Edit</ButtonLink>
                ) : ('')
              }
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
