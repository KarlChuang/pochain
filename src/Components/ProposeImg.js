import React, { Component } from 'react';
import styled from 'styled-components';

const ImgProposeBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow-x: scroll;
`;

const ImgInputBox = styled.div`
  width: 300px;
  height: 300px;
  margin: 10px;
  margin-left: 50px;
  background-color: #c5c5c51c;
  border: 5px solid #5f809054;
  transition: .3s;
  align-items: center;
  display: flex;
  justify-content: space-around;
  position: relative;
  :hover {
    background-color: #5b7c8c9e;
    border: 5px solid #5f809000;
    transition: .3s;
  }
`;

const ImgInput = styled.input`
  width: 300px;
  height: 300px;
  display: inline-block;
  cursor: pointer;
  opacity: 0;
`;

const ImgBox = styled.div`
  height: 300px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 10px;
  cursor: pointer;
  position: relative;
`;

const Img = styled.img`
  height: 300px;
  min-height: 300px;
  opacity: 1;
  transition: .3s;
  :hover {
    opacity: 0.2;
    transition: .3s;
  }
`;

const ImgDeleteIcon = styled.i`
  font-size: 120px;
  position: absolute;
  color: #0c0e0ebf;
  z-index: -1;
`;

const Icon = styled.i`
  font-size: 120px;
  position: absolute;
  margin: auto;
  color: #dde2e4;
`;

const ProposeImg = ({
  imagePreviewUrls,
  handleImgAdd,
  handleImgDelete,
}) => (
  <ImgProposeBlock>
    <ImgInputBox>
      <Icon className="fas fa-camera" />
      <ImgInput name="Product_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={handleImgAdd} />
    </ImgInputBox>
    {
      imagePreviewUrls.map(url => (
        <ImgBox key={url}>
          <ImgDeleteIcon className="fas fa-trash-alt" />
          <Img src={url} onClick={handleImgDelete} />
        </ImgBox>
      ))
    }
  </ImgProposeBlock>
);

export default ProposeImg;
