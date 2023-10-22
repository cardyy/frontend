import React from 'react';

export default function Nav(props) {
  return (
    <div className='nav-bar'>
      <span>
        Total players : {props.activePlayers}/{props.numPlayers}{' '}
      </span>
      <span>Game Code : {props.room} </span>
      <span>Cards in deck : {props.deck} </span>
      <span>Timer : 0s</span>
      <div className='small'>
        <button className='glow-on-hover' onClick={props.leaveRoom}>
          leave room
        </button>
      </div>
    </div>
  );
}
