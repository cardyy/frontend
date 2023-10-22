import React from 'react';
import './deck.css';
import deck from '../../../assets/audio/deck.mp3';
import shuffle from '../../../assets/audio/shuffle.mp3';

export default function Deck_component(props) {
  function playAudio(x) {
    if(x=='deck'){
      new Audio(deck).play();
    } else if(x=='shuffle'){
      new Audio(shuffle).play();
    }
    
  }
  function handleClick() {
    const id = localStorage.getItem('myId');
    const roomId = localStorage.getItem('roomId');
    const gameData = props.data;
    const credentials = {
      room: roomId,
      id: id,
    };
    const myPersonalData = gameData.players.find((item) => {
      return item.id === id;
    });
    if (gameData.gameOver === 'no') {
      playAudio('deck');
      if (gameData.mainDeck.length === 0) {
        props.message('There are no more cards in the deck..Shuffled');
        playAudio('shuffle');
        setTimeout(() => {
          props.message(null);
        }, 3000);
        props.socket.current.emit('shuffle', credentials);
      }

      if (
        gameData.activePlayer === localStorage.getItem('myId') &&
        gameData.gameStarted !== false
      ) {
        if (myPersonalData.nhonga === 0) {
          props.socket.current.emit('pick_card', credentials);
          props.next(true);
          props.message(
            'If you dont have a card press the button to move to the next player'
          );
          setTimeout(() => {
            props.message(null);
          }, 3000);
        } else if (
          myPersonalData.cant === 'no' &&
          myPersonalData.nhonga === 1
        ) {
          props.next(false);
          props.socket.current.emit('nhonga', credentials);

          props.socket.current.emit('cant', credentials);
        } else if (myPersonalData.nhonga > 1) {
          props.next(false);
          props.socket.current.emit('nhonga', credentials);
        }
      } else {
        props.message('Chimbomira! its not your turn yet...');
        setTimeout(() => {
          props.message(null);
        }, 1000);
      }
      props.setClickEvent((x) => {
        return !x;
      });
    }
  }
  return (
    <div>
      <img
        src={require('../../../assets/deck.png')}
        alt=''
        onClick={handleClick}
        className='deck'
      />
    </div>
  );
}
