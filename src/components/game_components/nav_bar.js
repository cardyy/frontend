import React from 'react';

export default function Nav(props) {
  return (
    <div className='nav-bar'>
      <span>Cards in deck : {props.deck} </span>
      <span>Room id : {props.room}</span>
      <span>Timer : 0s</span>
      <button onClick={props.leaveRoom}>leave room</button>
    </div>
  );
}
