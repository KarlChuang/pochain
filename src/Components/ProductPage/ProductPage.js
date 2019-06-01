import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { toLocalDateString } from '../../util/utils';
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

const ProductPage = ({
  topState: {
    id,
    name,
    producer,
    deadline,
    description,
    images,
    imagePtr,
    amount,
  },
  account,
  handleImgLeftClick,
  handleImgRightClick,
  handleAmountChange,
  handlePreOrder,
}) => (
  <Wrapper>
    <ProductName>{name}</ProductName>
    <ProductBrief>
      <ProductBox>
        <ImgIcon onClick={handleImgLeftClick} className="fas fa-chevron-left" />
        <ImgIcon onClick={handleImgRightClick} right className="fas fa-chevron-right" />
        <ProductImg src={images[imagePtr]} />
      </ProductBox>
      <ProductDiscription>
        <ProductOwner>{`Producer: ${producer}`}</ProductOwner>
        <ProductOwner>{`Deadline: ${toLocalDateString(deadline)}`}</ProductOwner>
        <ProductBriefDetail>{description}</ProductBriefDetail>
        <Buttons>
          <AmountBox>
            <AmountInput type="number" min="0" value={amount} onChange={handleAmountChange} />
            <Button onClick={handlePreOrder}>Pre-order</Button>
          </AmountBox>
          {
            (account === producer) ? (
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

export default ProductPage;
