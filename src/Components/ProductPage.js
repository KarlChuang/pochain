import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
  height: 440px;
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
  transform: ${({ right }) => (right ? 'rotate(4deg)' : 'rotate(-4deg)')};
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
  transition: .3s
  :hover {
    background-color: #888888;
    color: #ededed;
    transition: .3s
  }
`;

const ProductPage = ({ name = 'Apple', producer = 'Karl', deadline = Date.now(), detail = 'TTT'  }) => (
  <Wrapper>
    <ProductName>{name}</ProductName>
    <ProductBrief>
      <ProductImg />
      <ProductDiscription>
        <ProductOwner>Producer: {producer}</ProductOwner>
        <ProductOwner>Deadline: {toLocalDateString(deadline)}</ProductOwner>
        <ProductBriefDetail>{detail}</ProductBriefDetail>
        <Buttons>
          <Button>Pre-order</Button>
        </Buttons>
      </ProductDiscription>
    </ProductBrief>
    <SplitLine />
    <CommentList />
  </Wrapper>
);

ProductPage.propTypes = {
  name: PropTypes.string.isRequired,
  producer: PropTypes.string.isRequired,
  deadline: PropTypes.number.isRequired,
  detail: PropTypes.string.isRequired,
};

export default ProductPage;
