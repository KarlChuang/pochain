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

const ProposeBlock = styled.div`
  width: 80%;
`;

const Img = styled.img`
`;

class Propose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    console.log('hi');
    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }
  render() {
    // const ImgTag = ((this.state.imgPath === '') ? (
    //   <input type="file" onChange={e => this.setState({ imgPath: e.target.value })} />
    // ) : (
    //   <img src={this.state.imgPath} alt="hi" />
    // ));
    return (
      <Wrapper>
        <ProposeBlock>
          <form>
            <input name="Product_img" type="file" accept="image/gif, image/jpeg, image/png" onChange={this.handleInputChange} />
          </form>
          <img src={this.state.imagePreviewUrl} alt="hi" />
        </ProposeBlock>
      </Wrapper>
    );
  }
}

export default Propose;
