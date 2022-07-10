import React, { useState, useEffect } from 'react';
import Players from './players_component';
import Cards from './cards_component';
import CenterCards from './center_cards_component';
import Deck from './deck_component';
import Next from './next_component';
import NavBar from './nav_bar';
import Declare from './declare';
import DeclaredSuite from './declared_suit';
import UseFetch from '../../custom_hooks/useFetch';

export default function Game_component() {
  const [game_type, setGame_type] = useState(null);
  const {
    hasData,
    createRoom,
    message,
    leaveRoom,
    roomId,
    myHand,
    activePlayer,
    centerDeck,
    deck,
    setMessage,
    gameData,
    socketRef,
    setNext,
    next,
    joinRoom,
    hadDeclared,
    setHadDeclared,
    setClickEvent,
  } = UseFetch();
  useEffect(() => {
    const type = localStorage.getItem('game_type');
    setGame_type(type);
  }, [game_type]);

  const handleClick = (x) => {
    localStorage.setItem('game_type', x);
    setGame_type(x);
  };

  const handleClose = () => {
    document.getElementById('id01').style.display = 'none';
  };

  const handleCreate = () => {
    document.getElementById('id01').style.display = 'block';
  };
  if (roomId && hasData) {
    return (
      <div className='bg'>
        <NavBar leaveRoom={leaveRoom} deck={deck} room={roomId} />
        <CenterCards centerCards={centerDeck} />
        <Deck
          message={setMessage}
          data={gameData}
          socket={socketRef}
          next={setNext}
          setClickEvent={setClickEvent}
        />
        <Cards
          myHand={myHand}
          message={setMessage}
          data={gameData}
          socket={socketRef}
          next={setNext}
          setHadDeclared={setHadDeclared}
          setClickEvent={setClickEvent}
        />
        <DeclaredSuite declare={gameData.declare} />
        {hadDeclared && (
          <Declare
            hadDeclared={hadDeclared}
            setHadDeclared={setHadDeclared}
            socket={socketRef}
            message={setMessage}
            setClickEvent={setClickEvent}
          />
        )}
        {next && (
          <Next
            socket={socketRef}
            next={setNext}
            setClickEvent={setClickEvent}
          />
        )}
        <span className='room-message'>{message}</span>
      </div>
    );
  } else {
    return (
      <div className='home'>
        <img src={require('../../assets/text.png')} alt='' width='130rem' />

        <div id='id01' class='w3-modal'>
          <div class='w3-modal-content w3-animate-opacity'>
            <span class='w3-button w3-display-topright' onClick={handleClose}>
              &times;
            </span>
            <div class='w3-container'>
              {game_type === 'rest of world' && (
                <div className='modal-container'>
                  <span>
                    <h4>Choose number of players to begin game.</h4>
                  </span>
                  <div className='num-players'>
                    <div>
                      <img
                        src={require('../../assets/two.png')}
                        alt=''
                        width='50rem'
                      />
                      <p>Two players</p>
                    </div>
                    <div>
                      <img
                        src={require('../../assets/three.png')}
                        alt=''
                        width='50rem'
                      />
                      <p>Three players</p>
                    </div>
                    <div>
                      <img
                        src={require('../../assets/four.png')}
                        alt=''
                        width='50rem'
                      />
                      <p>Four players</p>
                    </div>
                  </div>
                </div>
              )}
              {game_type === null && (
                <div>
                  <p onClick={() => handleClick('rest of world')}>
                    Play with random people.
                  </p>
                  <p onClick={() => handleClick('friends')}>
                    Play with friends and family.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='button-container'>
          <button onClick={handleCreate}>Create game</button>
          <button onClick={joinRoom}>Join game</button>
        </div>
      </div>
    );
  }
}
