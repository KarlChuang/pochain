import React from 'react';

import { Waitingwrapper, Font, MesChar, Message, Circle, Mes } from './WaitingStyle';

const NoteMd = ['P', 'o', 'C', 'h', 'a', 'i', 'n', '.', '.', '.'];

export const Waiting = () => (
  <Waitingwrapper>
    {
      NoteMd.map((char, index) => <Font key={index} delay={index}>{char}</Font>)
    }
  </Waitingwrapper>
);

const loginStr = 'Please log in first!';
const loginMes = [];
for (let i = 0; i < loginStr.length; i += 1) {
  loginMes[i] = loginStr.charAt(i);
}

export const HomeMes = () => (
  <Message>
    <Circle delay={0} />
    <Circle delay={1.5} />
    <Circle delay={3} />
    <Mes>
      {
        loginMes.map((char, index) => (<MesChar key={index} delay={index}>{char}</MesChar>))}
    </Mes>
  </Message>
);
