import React from 'react';
import './declare.css';

export default function Declare(props) {
  const handleClick = (a) => {
    const id = localStorage.getItem('myId');
    const roomId = localStorage.getItem('roomId');
    props.setHadDeclared(false);
    const deaclareCredentials = {
      room: roomId,
      id: id,
      a: a,
    };
    props.socket.current.emit('declare', deaclareCredentials);
    props.message(null);
    props.setClickEvent((x) => {
      return !x;
    });
  };
  const cards = ['C', 'D', 'H', 'S'];
  return (
    <div className='declare'>
      {cards.map((card, index) => (
        <img
          src={require(`../../../assets/${card}.png`)}
          alt=''
          key={index}
          className='declare-cards'
          onClick={() => handleClick(card)}
        />
      ))}
    </div>
  );
}
