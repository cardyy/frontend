import React from 'react';
import Players from './players_component';
import Cards from './cards_component';
import CenterCards from './center_cards_component';
import Deck from './deck_component';
import Next from './next_component';
import NavBar from './nav_bar';
import Declare from './declare';
import DeclaredSuite from './declared_suit';
import UseFetch from '../../custom_hooks/useFetch';
import LandingPage from './landing_page_component';
import GameOver from './gameOver/gameOver.component';

export default function Game_component() {
  const {
    hasData,
    createRoom,
    message,
    leaveRoom,
    roomId,
    myHand,
    numPlayers,
    activePlayer,
    activePlayers,
    centerDeck,
    deck,
    setMessage,
    rest,
    gameData,
    socketRef,
    setNext,
    next,
    joinRoom,
    hadDeclared,
    setHadDeclared,
    setClickEvent,
  } = UseFetch();

  if (roomId && hasData) {
    return (
      <div className='bg'>
        <NavBar
          leaveRoom={leaveRoom}
          deck={deck}
          room={roomId}
          numPlayers={numPlayers}
          activePlayers={activePlayers.length}
        />
        {gameData.gameOver === 'yes' && <GameOver />}
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
        <LandingPage
          joinRoom={joinRoom}
          createRoom={createRoom}
          setClickEvent={setClickEvent}
          socket={rest}
        />
      </div>
    );
  }
}
