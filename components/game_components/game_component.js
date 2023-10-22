import React from 'react';
import Players from './players_component';
import Cards from './cards_component/cards_component';
import CenterCards from './center_cards_component/center_cards_component';
import Deck from './deck_component/deck_component';
import Next from './next_component';
import NavBar from './nav_bar';
import Declare from './declare/declare';
import DeclaredSuite from './declare/declared_suit';
import UseFetch from '../../custom_hooks/useFetch';
import LandingPage from './landing_page/landing_page_component';
import GameOver from './game_over_component/game_over.component';

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
    players,
    myID,
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
    show_gameOver_buttons,
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
        <Players
          activePlayer={activePlayer}
          roomID={roomId}
          activePlayers={players}
          id={myID}
        />
        {gameData.gameOver === 'yes' && (
          <GameOver
            show_gameOver_buttons={show_gameOver_buttons}
            GameOver={gameData.gameOver}
          />
        )}
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
