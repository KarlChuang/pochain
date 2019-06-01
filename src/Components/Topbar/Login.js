import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: inherit;
  /* text-align: center; */
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  padding-top: 130px;
  padding-bottom: 50px;
  text-align: left;
  padding: 20%;
  font-family: 'Neucha', cursive;
  font-size: 30px;
`;

const Login = () => (
  <Wrapper>
    1. Use firefox or chrome<br /><br />
    2. Download MetaMask from the extension<br /><br />
    3. Link MetaMask to your ethereum accounts<br /><br />
    4. Accept PoChain to access MetaMask accounts<br /><br />
  </Wrapper>
);

export default Login;
