import React from 'react';
import './Nav.css'; // Assuming you separate your CSS

export default function Nav(props) {

  return (
    <div className='nav-bar'>
      <span>
        Total players : {props.activePlayers}/{props.numPlayers}{' '}
      </span>
      <span>Game Code : {props.room} </span>
      <span>Cards in deck : {props.deck} </span>
      <div className='small'>
        <button  onClick={props.leaveRoom}>
          leave room
        </button>
      </div>
    </div>
  );
}
