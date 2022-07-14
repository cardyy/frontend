import React from 'react';
import './game_over.css';

export default function GameOver() {
  const handleButtonClick = () => {
    window.location.reload();
  };
  return (
    <div id='tudo'>
      <div class='gameover'>
        <p> GAME </p>
        <p> OVER </p>
      </div>

      <div class='continue'>
        <p> CONTINUE? </p>
      </div>

      <div class='opcoes'>
        <div class='yes'>
          <button className='glow-on-hover' onClick={handleButtonClick}>
            Yes
          </button>
        </div>
        <div class='no'>
          <button className='glow-on-hover' onClick={handleButtonClick}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
