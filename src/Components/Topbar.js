import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

const Topbarwrapper = styled.div`
  width: 100%;
  position: fixed;
  background-color: rgba(235, 235, 235, 0.9);
  box-shadow: 0px 4px 21px -1px #ccc;
  height: 80px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  z-index: 1;  
`;

const Title = styled(Link)`
  margin-left: 20px;
  font-size: 35px;
  font-family: 'Righteous', cursive;
  font-weight: 800;
  letter-spacing: 4px;
  text-decoration: none;
  color: black;
`;

const ToolDiv = styled.div`
  height: 100%;
  margin-right: 15px;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Tool = styled(Link)`
  font-size: 18px;
  color: rgb(160, 160, 160);
  ${({ page, label }) => ((page === label) ? `
    color: black;
    cursor: default;
    pointer-events: none;
  ` : '')}
  transition: .3s;
  margin: 20px;
  text-decoration: none;
  font-family: 'Neucha', cursive;
  transform: scale(1.2, 1);
  :hover {
    color: black;
    transition: .5s;
  }
`;

const Topbar = ({ location }) => (
  <Topbarwrapper>
    <Title to="/">PoChain</Title>
    <ToolDiv>
      <Tool to="/propose" label="/propose/" page={location.pathname}>PROPOSE</Tool>
      <Tool to="/login" label="/login/" page={location.pathname}>LOGIN</Tool>
    </ToolDiv>
  </Topbarwrapper>
);

const TopbarRouter = withRouter(props => <Topbar {...props} />);

Topbar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default TopbarRouter;
