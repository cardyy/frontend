import React from 'react';

const Players_component = (props) => {
  const glow = (id) => {
    if (props.activePlayer === id) {
      return 'glow';
    }
  };

  return (
    <div className='players'>
      {props.activePlayers.map((playerId, index) => (
        <div className={`${glow(playerId)} av-bot`} id={`${index}${index}`} key={index} />
      ))}
    </div>
  );
};

export default Players_component;
