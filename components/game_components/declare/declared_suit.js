import React from 'react';
import './declare.css';

export default function Declared_suit(props) {
  switch (props.declare) {
    case 'C':
      return (
        <img
          src={require('../../../assets/C.png')}
          alt=''
          className='declared'
        />
      );
    case 'D':
      return (
        <img
          src={require('../../../assets/D.png')}
          alt=''
          className='declared'
        />
      );
    case 'H':
      return (
        <img
          src={require('../../../assets/H.png')}
          alt=''
          className='declared'
        />
      );
    case 'S':
      return (
        <img
          src={require('../../../assets/S.png')}
          alt=''
          className='declared'
        />
      );
    default:
      return null;
  }
}
