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
  align-items: center;
`;

const Login = () => (
  <Wrapper>
    login
  </Wrapper>
);

export default Login;
