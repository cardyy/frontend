import React from 'react';

const Players_component = (props) => {
  const glow = (id) => {
    if (props.activePlayer === id) {
      return 'glow';
    }
  };

  console.log('props.activePlayers',props.activePlayers)

  return (
    <div >
      {props.activePlayers.map(player => (
        <div key={player.id} className="av-container">
          <div className={`${glow(player.id)} av-bot`} id={`player-${player.id}`} /> 
          <h4>{player.username}</h4> {}
        </div>
      ))}
    </div>
  );
};

export default Players_component;
