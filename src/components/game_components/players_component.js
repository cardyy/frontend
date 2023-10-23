import React from 'react';
import PlayerAudioComponent from './PlayerAudioComponent';
import './players_component.css';

const Players_component = (props) => {
  const glow = (id) => {
    if (props.activePlayer === id) {
      return 'glow';
    }
  };

  return (
    <div >
      {props.activePlayers?.map(player => (
        <div key={player.id} className="av-container">
          <div className='player-container'>
          <div className={`${glow(player.id)} av-bot`} id={`player-${player.id}`} /> 
          {player.id === props.id && (<PlayerAudioComponent roomID={props.roomID} numPlayers={props.activePlayers.length}/>)}
          </div>
          <h4>{player.username}: {player.playerHand.length} cards</h4> {}
        </div>
      ))}
    </div>
  );
};

export default Players_component;