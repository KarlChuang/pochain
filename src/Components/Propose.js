import React, { Component } from 'react';
import styled from 'styled-components';

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

const ImgProposeBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const ImgInputBox = styled.div`
  width: 300px;
  height: 300px;
  margin: 10px;
  margin-left: 50px;
  background-color: #c5c5c51c;
  border: 5px solid #5f809054;
  transition: .3s;
  :hover {
    background-color: #5b7c8c9e;
    border: 5px solid #5f809000;
    transition: .3s;
  }
`;

const ImgForm = styled.form`
  align-items: center;
  display: flex;
  justify-content: space-around;
`;

const ImgInput = styled.input`
  width: 300px;
  height: 300px;
  display: inline-block;
  cursor: pointer;
  opacity: 0;
`;

const Img = styled.img`
  height: 300px;
  margin: 10px;
  min-height: 300px;
`;

const Icon = styled.i`
  font-size: 120px;
  position: absolute;;
  margin: auto;
  color: #dde2e4;
`;

class Propose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      imagePreviewUrls: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
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
  }
  render() {
    return (
      <Wrapper>
        <ImgProposeBlock>
          <ImgInputBox>
            <ImgForm>
              <Icon className="fas fa-camera" />
              <ImgInput name="Product_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={this.handleInputChange} />
            </ImgForm>
          </ImgInputBox>
          {
            this.state.imagePreviewUrls.map(url => (<Img src={url} key={url} alt={url} />))
          }
        </ImgProposeBlock>
      </Wrapper>
    );
  }
}

export default Propose;
