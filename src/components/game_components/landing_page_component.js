import React, { useState, useEffect } from 'react';

export default function LandingPage(props) {
  const [game_type, setGame_type] = useState(null);
  const [button_action, setButton_action] = useState(null);
  const [clickEvent, setClickEvent] = useState(false);
  const [input, setInput] = useState('');
  useEffect(() => {
    const type = localStorage.getItem('game_type');
    const action = localStorage.getItem('button_action');

    setGame_type(type);
    setButton_action(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('game_type'), game_type, button_action, clickEvent]);

  const handleClick = (x) => {
    localStorage.setItem('game_type', x);
    const action = localStorage.getItem('button_action');
    if (action === 'j' && x === 'r')
      document.getElementById('id01').style.display = 'none';
    setGame_type(x);
  };

  const handleClose = (x) => {
    document.getElementById(x).style.display = 'none';
    localStorage.removeItem('game_type');
    localStorage.removeItem('button_action');
    setButton_action(null);
  };

  const handleButtonClick = (x) => {
    localStorage.setItem('button_action', x);
    setClickEvent((x) => {
      return !x;
    });
  };

  return (
    <>
      <img src={require('../../assets/text.png')} alt='' width='130rem' />
      {game_type === 'r' && button_action === 'j' && (
        <div
          id='id02'
          className='w3-modal2'
          onClick={() => handleClose('id02')}>
          <div className='w3-modal-content2 '>
            <div className='card-lnading'>
              <img
                src={require('../../assets/push.png')}
                alt=''
                width='50rem'
                height='50rem'
              />
              <p>
                {} of {} players in game
              </p>
              <button className='glow-on-hover'>Enter game</button>
            </div>
          </div>
        </div>
      )}

      {button_action === null && (
        <div className='button-container'>
          <button
            className='glow-on-hover'
            onClick={() => handleButtonClick('c')}>
            Create game
          </button>
          <button
            className='glow-on-hover'
            onClick={() => handleButtonClick('j')}>
            Join game
          </button>
        </div>
      )}
      {button_action !== null && (
        <div id='id01' className='w3-modal'>
          <div className='w3-modal-content w3-animate-opacity'>
            <span
              className='w3-button w3-display-topright'
              onClick={() => handleClose('id01')}>
              &times;
            </span>
            <div className='w3-container'>
              {game_type !== null && button_action === 'c' && (
                <div className='modal-container'>
                  <span>
                    <h4>Choose number of players to begin game.</h4>
                  </span>
                  <div className='num-players'>
                    <div onClick={() => props.createRoom(2, game_type)}>
                      <img
                        src={require('../../assets/two.png')}
                        alt=''
                        width='50rem'
                        height='40rem'
                      />
                      <p>Two players</p>
                    </div>
                    <div onClick={() => props.createRoom(3, game_type)}>
                      <img
                        src={require('../../assets/three.png')}
                        alt=''
                        width='50rem'
                        height='40rem'
                      />
                      <p>Three players</p>
                    </div>
                    <div onClick={() => props.createRoom(4, game_type)}>
                      <img
                        src={require('../../assets/four.png')}
                        alt=''
                        width='50rem'
                        height='40rem'
                      />
                      <p>Four players</p>
                    </div>
                  </div>
                </div>
              )}
              {game_type === null && (
                <div>
                  <p className='button-link' onClick={() => handleClick('r')}>
                    Play with random people
                  </p>
                  <p onClick={() => handleClick('f')}>
                    Play with friends and family
                  </p>
                </div>
              )}
              {game_type === 'f' && button_action === 'j' && (
                <div className='join-input'>
                  <input
                    id='code-input'
                    placeholder='Enter game code'
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    required
                  />
                  <button
                    className='glow-on-hover'
                    onClick={() => {
                      props.joinRoom(input);
                      setInput('');
                    }}>
                    Enter game
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
