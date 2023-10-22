import React from 'react';
import nextSound from '../../assets/audio/next.mp3'

export default function Next_component(props) {
  function playAudio() {
    new Audio(nextSound).play();
  }
  const next = () => {

    const room = localStorage.getItem('roomId');
    const id = localStorage.getItem('myId');
    const credentials = {
      room,
      id,
    };
    playAudio();
    props.socket.current.emit('next', credentials);
    props.next(false);
    props.setClickEvent((x) => {
      return !x;
    });
  };
  return (
    <div>
      <img
        src={require('../../assets/next.png')}
        alt=''
        className='next'
        onClick={next}
      />
    </div>
  );
}
