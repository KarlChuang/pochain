import styled from 'styled-components';

export const Waitingwrapper = styled.div`
  font-family: 'Righteous', cursive;
  display: flex;
  font-size: 25px;
  height: 70px;
  margin: auto;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 8px;
  color: black;
`;

export const Font = styled.div`
  animation: Jump 1.3s ease-in-out infinite;
  animation-delay: ${({ delay }) => 0.05 * delay}s;
  margin-top: 35px;
  @keyframes Jump {
    0%, 50% {
      margin-top: 35px;
    }
    25% {
      margin-top: 0px;
    }
  }
`;

export const Message = styled.div`
  width: 200px;
  height: 200px;
`;

const MesParent = styled.div`
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
`;

export const Mes = styled(MesParent)`
  height: 30px;
  color: #607D8B;
  font-size: 24px;
  font-family: Nova Flat;
  display: flex;
  width: 265px;
`;

export const MesChar = styled.div`
  width: 13px;
  opacity: 0;
  animation: ld-in 6s ease infinite;
  animation-delay: ${({ delay }) => 0.1 * delay}s;
  @keyframes ld-in {
    0%, 9%, 80% {
      opacity: 0;
      margin-left: 0px;
      margin-top: 0px;
    }
    10% {
      opacity: 0;
      margin-left: -10px;
      margin-top: -20px;
    }
    20%, 70% {
      opacity: 1;
      margin-left: 0px;
      margin-top: 0px;
    }
  }
`;

export const Circle = styled(MesParent)`
  width: 0px;
  height: 0px;
  border-style: solid;
  border-radius: 50%;
  border-color: rgba(96, 125, 139, 0.24);
  animation: 4.5s move ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
  @keyframes move {
    0% {
      width: 0px;
      height: 0px;
    }
    100% {
      width: 150px;
      height: 150px;
      border-color: rgba(96, 125, 139, 0);
    }
  }
`;

export const Alertwrapper = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: fixed;
  font-size: 25px;
  background-color: #000000d1;
  height: 100%;
  width: 100%;
  z-index: 4000;
`;

export const AlertBox = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 400px;
  height: 250px;
  font-family: 'Neucha', cursive;
  color: black;
  background-color: white;
`;

export const AlertMsg = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-grow: 1;
  width: 100%;
`;

export const AlertButtonDiv = styled.div`
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 50px;
  width: 100%;
`;

export const AlertButton = styled.button`
  width: 50%;
  height: 100%;
  border: 1;
  color: white;
  font-size: 20px;
  background-color: ${({ sig }) => ((sig) ? '#a50303' : '#468dab')};
  font-family: 'Neucha', cursive;
  cursor: pointer;
  transition: .3s;
  :hover {
    background-color: ${({ sig }) => ((sig) ? '#ff2f2f' : '#55ccff')};
    transition: .3s;
  }
`;
