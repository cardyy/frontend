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

export default function Game_component() {
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
    clickEvent,
  } = UseFetch();

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
          click={setClickEvent}
          clickEvent={clickEvent}
        />
        <Cards
          myHand={myHand}
          message={setMessage}
          data={gameData}
          socket={socketRef}
          next={setNext}
          setHadDeclared={setHadDeclared}
          click={setClickEvent}
          clickEvent={clickEvent}
        />
        <DeclaredSuite
          declare={gameData.declare}
          click={setClickEvent}
          clickEvent={clickEvent}
        />
        {hadDeclared && (
          <Declare
            hadDeclared={hadDeclared}
            setHadDeclared={setHadDeclared}
            socket={socketRef}
            message={setMessage}
            click={setClickEvent}
            clickEvent={clickEvent}
          />
        )}
        {next && (
          <Next
            socket={socketRef}
            next={setNext}
            click={setClickEvent}
            clickEvent={clickEvent}
          />
        )}
        <span className='room-message'>{message}</span>
      </div>
    );
  } else {
    return (
      <>
        <button onClick={createRoom}>Create room</button>
        <button onClick={joinRoom}>Join room</button>
      </>
    );
  }
}
