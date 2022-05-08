import React from 'react';

export default function Next_component(props) {
  const next = () => {
    const room = localStorage.getItem('roomId');
    const id = localStorage.getItem('myId');
    const credentials = {
      room,
      id,
    };
    props.socket.current.emit('next', credentials);
    props.next(false);
    props.click(!props.clickEvent);
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
