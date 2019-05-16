import React, { Component } from 'react';
import styled from 'styled-components';

import ProposeImg from './ProposeImg';

const Wrapper = styled.div`
  width: inherit;
  /* text-align: center; */
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding-top: 130px;
  align-items: center;
  margin-bottom: 50px;
`;

const ProposeDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;

const ProposeBlock = styled.div`
  width: 80%
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  margin-top: 40px;
`;

const Title = styled.div`
  height: 100%;
  font-size: 25px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-family: 'Neucha', cursive;
`;

const TitleInput = styled.input`
  flex-grow: 1;
  height: 100%;
  border: 2px solid;
  border-radius: 8px;
  font-size: 22px;
  padding-left: 10px;
  padding-right: 10px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1.5px;
`;

const ProposeBlockDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 80%;
  margin-top: 40px;
  margin-bottom: 30px;
`;

const DescriptionInput = styled.textarea`
  margin-top: 20px;
  border: 2px solid;
  border-radius: 8px;
  resize: none;
  height: 300px;
  font-size: 22px;
  padding: 10px;
  font-family: 'Neucha', cursive;
  letter-spacing: 1.5px;
`;

const ButtonBlock = styled(ProposeBlock)`
  justify-content: space-around;
`;

const Button = styled.button`
  border: 0;
  background-color: gray;
  font-family: 'Neucha', cursive;
  background-color: #bfbfbf;
  border-radius: 7px;
  font-size: 24px;
  width: 250px;
  height: 35px;
  transition: .3s;
  cursor: pointer;
  :hover {
    background-color: #4e5f67d1;
    color: white;
    transition: .3s;
  }
`;

class Propose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: '',
      productDeadline: '',
      productDescription: '',
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  handleTitleChange(e) {
    this.setState({
      productName: e.target.value,
    });
  }
  handleDateChange(e) {
    this.setState({
      productDeadline: e.target.value,
    });
  }
  handleDescriptionChange(e) {
    this.setState({
      productDescription: e.target.value,
    });
  }
  render() {
    const { productName, productDeadline, productDescription } = this.state;
    return (
      <Wrapper>
        <ProposeImg />
        <ProposeDetail>
          <ProposeBlock>
            <Title>Product Name</Title>
            <TitleInput onChange={this.handleTitleChange} value={productName} />
          </ProposeBlock>
          <ProposeBlock>
            <Title>Deadline</Title>
            <TitleInput type="date" onChange={this.handleDateChange} value={productDeadline} />
          </ProposeBlock>
          <ProposeBlockDescription>
            <Title>Product Description</Title>
            <DescriptionInput onChange={this.handleDescriptionChange} value={productDescription} />
          </ProposeBlockDescription>
        </ProposeDetail>
        <ButtonBlock>
          <Button>save</Button>
          <Button>commit</Button>
        </ButtonBlock>
      </Wrapper>
    );
  }
}

export default Propose;
