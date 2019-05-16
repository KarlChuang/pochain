import React, { Component } from 'react';
import styled from 'styled-components';

const ImgProposeBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  position: absolute;;
  margin: auto;
  color: #dde2e4;
`;

class ProposeImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      imagePreviewUrls: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImgDelete = this.handleImgDelete.bind(this);
  }
  handleInputChange(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        files: [...this.state.files, file],
        imagePreviewUrls: [...this.state.imagePreviewUrls, reader.result],
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  handleImgDelete(e) {
    const arr = [...this.state.imagePreviewUrls];
    const files = [...this.state.files];
    const index = arr.indexOf(e.target.src);
    if (index !== -1) {
      arr.splice(index, 1);
      files.splice(index, 1);
      this.setState({ imagePreviewUrls: arr, files });
    }
  }
  render() {
    return (
      <ImgProposeBlock>
        <ImgInputBox>
          <Icon className="fas fa-camera" />
          <ImgInput name="Product_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={this.handleInputChange} />
        </ImgInputBox>
        {
          this.state.imagePreviewUrls.map(url => (
            <ImgBox key={url}>
              <ImgDeleteIcon className="fas fa-trash-alt" />
              <Img src={url} alt={url} onClick={this.handleImgDelete} />
            </ImgBox>
          ))
        }
      </ImgProposeBlock>
    );
  }
}

export default ProposeImg;
