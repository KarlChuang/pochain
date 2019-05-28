import React, { Component } from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import sha256 from 'js-sha256';

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

// const AlertBox = styled.div`
//   position: fixed;
//   font-size: 25px;
//   top: 40%;
//   background-color: #21212182;
//   color: white;
//   padding-left: 60px;
//   padding-right: 60px;
//   padding-top: 6px;
//   border-radius: 15px;
//   font-family: 'Neucha', cursive;
//   opacity: ${({ show }) => (show ? 1 : 0)};
// `;

class Propose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: -1,
      productName: '',
      productDeadline: '',
      productPrice: '',
      productDescription: '',
      productImg: {
        files: [],
        urls: [],
      },
    };
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.handleImgAdd = this.handleImgAdd.bind(this);
    this.handleImgDelete = this.handleImgDelete.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  }
  async componentDidMount() {
    const { location } = this.props;
    const account = await this.props.detectAccountChange();
    const productId = location.pathname.split('/')[2];
    if (productId.length > 0) {
      let res = await fetch(`/api/product/${productId}`);
      const fileResponse = await res.json();
      res = await fetch(`/api/product_img/${productId}`);
      const imageResponse = await res.json();
      if (fileResponse[0].producer !== account) {
        window.location.replace('/user/');
      } else {
        const productImg = {
          files: [],
          urls: [],
        };
        for (let i = 0; i < imageResponse.length; i += 1) {
          productImg.urls.push(`data:image/png;base64,${btoa(String.fromCharCode.apply(null, imageResponse[i].image.data))}`);
          productImg.files.push(imageResponse[i].id);
        }
        this.setState({
          productName: fileResponse[0].name,
          productDeadline: fileResponse[0].deadline.split('T')[0],
          productDescription: fileResponse[0].description,
          productPrice: fileResponse[0].price,
          productImg,
          productId: parseInt(productId, 10),
        });
      }
    }
  }
  handleImgAdd(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        productImg: {
          files: [...this.state.productImg.files, file],
          urls: [...this.state.productImg.urls, reader.result],
        },
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  handleImgDelete(e) {
    const arr = [...this.state.productImg.urls];
    const files = [...this.state.productImg.files];
    const index = arr.indexOf(e.target.src);
    if (index !== -1) {
      arr.splice(index, 1);
      files.splice(index, 1);
      this.setState({
        productImg: {
          urls: arr,
          files,
        },
      });
    }
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
  handlePriceChange(e) {
    this.setState({
      productPrice: e.target.value,
    });
  }
  handleDescriptionChange(e) {
    this.setState({
      productDescription: e.target.value,
    });
  }
  async handleSave() {
    const account = await this.props.detectAccountChange();
    const {
      productId,
      productName,
      productDeadline,
      productDescription,
      productPrice,
      productImg,
    } = this.state;
    if (this.props.account === 'LOGIN' || this.props.account === '' || this.props.account === undefined) {
      alert('Account error, please login to MetaMask again');
    } else if (productName === '' || productDeadline === '') {
      alert('Product name and deadline cannot be blank');
    } else if (new Date(productDeadline).getTime() <= Date.now()) {
      alert('Product deadline should be a future time point');
    } else {
      // hash the data
      const hash = sha256([
        productName,
        productDeadline,
        productDescription,
        parseInt(productPrice, 10),
        account,
        productImg.urls,
      ]);

      // create form
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('productName', productName);
      formData.append('productDeadline', productDeadline);
      formData.append('productDescription', productDescription);
      formData.append('productPrice', productPrice);
      formData.append('producer', account);
      formData.append('hash', hash);
      productImg.files.forEach(file => formData.append('image', file));

      const res = await fetch('/api/new-product', {
        method: 'POST',
        body: formData,
      });
      const fetchRes = await res.json();
      if (fetchRes.message === 'success') {
        this.setState({
          productId: parseInt(fetchRes.id, 10),
          productImg: {
            ...this.state.productImg,
            files: fetchRes.imgIds,
          },
        });
        alert('Save to the server!');
      } else {
        alert(fetchRes.message);
      }
    }
  }
  async handleCommit() {
    await this.handleSave();
    const account = await this.props.detectAccountChange();
    const {
      productName,
      productDeadline,
      productDescription,
      productPrice,
      productImg,
    } = this.state;
    const hash = sha256([
      productName,
      productDeadline,
      productDescription,
      parseInt(productPrice, 10),
      account,
      productImg.urls,
    ]);
    // save to blockchain
    this.props.productContract.methods
      .createproduct(hash, parseInt(productPrice, 10), 20)
      .send({ from: account });
  }
  render() {
    const {
      productName,
      productDeadline,
      productPrice,
      productDescription,
      productImg,
    } = this.state;
    return (
      <Wrapper>
        <ProposeImg
          imagePreviewUrls={productImg.urls}
          handleImgAdd={this.handleImgAdd}
          handleImgDelete={this.handleImgDelete}
        />
        <ProposeDetail>
          <ProposeBlock>
            <Title>Product Name</Title>
            <TitleInput onChange={this.handleTitleChange} value={productName} />
          </ProposeBlock>
          <ProposeBlock>
            <Title>Deadline</Title>
            <TitleInput type="date" onChange={this.handleDateChange} value={productDeadline} />
            <Title>Price</Title>
            <TitleInput onChange={this.handlePriceChange} value={productPrice} />
          </ProposeBlock>
          <ProposeBlockDescription>
            <Title>Product Description</Title>
            <DescriptionInput onChange={this.handleDescriptionChange} value={productDescription} />
          </ProposeBlockDescription>
        </ProposeDetail>
        <ButtonBlock>
          <Button onClick={this.handleSave}>save</Button>
          <Button onClick={this.handleCommit}>commit</Button>
        </ButtonBlock>
      </Wrapper>
    );
  }
}

Propose.propTypes = {
  detectAccountChange: PropTypes.func.isRequired,
  account: PropTypes.string.isRequired,
};

const ProposeRouter = withRouter(props => <Propose {...props} />);

export default ProposeRouter;
