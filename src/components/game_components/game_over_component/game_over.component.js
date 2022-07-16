import React from 'react';
import './game_over.css';

export default function GameOver(props) {
  const handleButtonClick = () => {
    window.location.reload();
    localStorage.removeItem('game_type');
    localStorage.removeItem('button_action');
  };
  return (
    <div id='tudo'>
      <div class='gameover'>
        <p> GAME </p>
        <p> OVER </p>
      </div>

      {props.GameOver === 'yes' && props.show_gameOver_buttons === false && (
        <div class='wrapper'>
          <div class='circle'></div>
          <div class='circle'></div>
          <div class='circle'></div>
          <div class='shadow'></div>
          <div class='shadow'></div>
          <div class='shadow'></div>
          <span>Loading</span>
        </div>
      )}
      {props.GameOver === 'yes' && props.show_gameOver_buttons === true && (
        <>
          {' '}
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
        </>
      )}
    </div>
  );
}
