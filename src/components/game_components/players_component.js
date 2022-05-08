import React, { useRef, useEffect } from 'react';

export default function Players_component(props) {
  const id = localStorage.getItem('myId');
  const glow = (id) => {
    if (props.activePlayer === id) {
      return 'glow';
    }
  };

  const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
      props.peer.on('stream', (stream) => {
        ref.current.srcObject = stream;
      });
    }, [props.peer]);

    return (
      <video
        playsInline
        muted
        ref={ref}
        autoPlay
        className={`avators ${glow(id)}`}
      />
    );
  };

  const render_players = () => {
    return (
      <div className='players'>
        <video
          playsInline
          muted
          ref={props.streams}
          autoPlay
          className={`avators ${glow(id)}`}
        />
        {props.peers.map((peer, index) => {
          return <Video key={index} peer={peer} />;
        })}
      </div>
    );
  };
  return render_players();
}
