import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import ProposeImg from './ProposeImg';

const Wrapper = styled.div`
  /* width: inherit; */
  /* text-align: center; */
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding-top: 130px;
  align-items: center;
  /* margin-bottom: 50px; */
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

const ProposeDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  flex-shrink: 0;
`;

const ProposeBlock = styled.div`
  width: 80%;
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
  margin-right: 10px;
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
  flex-shrink: 0;
  margin-bottom: 50px;
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

const Propose = ({
  topState: {
    productName,
    productDeadline,
    productPrice,
    productDescription,
    productImg,
    productBaseline,
  },
  handleTitleChange,
  handleDescriptionChange,
  handleDateChange,
  handleSave,
  handleCommit,
  handleImgAdd,
  handleImgDelete,
  handlePriceChange,
  handleBaselineChange,
}) => (
  <Wrapper>
    <ProposeImg
      imagePreviewUrls={productImg.urls}
      handleImgAdd={handleImgAdd}
      handleImgDelete={handleImgDelete}
    />
    <ProposeDetail>
      <ProposeBlock>
        <Title>Product Name</Title>
        <TitleInput onChange={handleTitleChange} value={productName} />
      </ProposeBlock>
      <ProposeBlock>
        <Title>Deadline</Title>
        <TitleInput type="date" onChange={handleDateChange} value={productDeadline} />
      </ProposeBlock>
      <ProposeBlock>
        <Title>Price</Title>
        <TitleInput onChange={handlePriceChange} value={productPrice} />
        <Title>Baseline</Title>
        <TitleInput onChange={handleBaselineChange} value={productBaseline} />
      </ProposeBlock>
      <ProposeBlockDescription>
        <Title>Product Description</Title>
        <DescriptionInput onChange={handleDescriptionChange} value={productDescription} />
      </ProposeBlockDescription>
    </ProposeDetail>
    <ButtonBlock>
      <Button onClick={handleSave}>save</Button>
      <Button onClick={handleCommit}>commit</Button>
    </ButtonBlock>
  </Wrapper>
);

Propose.propTypes = {
  topState: PropTypes.shape({
    productName: PropTypes.string.isRequired,
    productDeadline: PropTypes.string.isRequired,
    productPrice: PropTypes.string.isRequired,
    productBaseline: PropTypes.string.isRequired,
    productDescription: PropTypes.string.isRequired,
    productImg: PropTypes.shape({
      files: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          size: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired,
        }),
      ])).isRequired,
      urls: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleDescriptionChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCommit: PropTypes.func.isRequired,
  handleImgAdd: PropTypes.func.isRequired,
  handleImgDelete: PropTypes.func.isRequired,
  handlePriceChange: PropTypes.func.isRequired,
  handleBaselineChange: PropTypes.func.isRequired,
};

export default Propose;
