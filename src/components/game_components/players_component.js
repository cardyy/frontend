import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

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
      className='avators av-top'
      id={`${props.pos}`}
    />
  );
};

const Players_component = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.roomID;
  const glow = (id) => {
    if (props.activePlayer === id) {
      return 'glow';
    }
  };

  useEffect(() => {
    for (let i = 0; i <= peers.length; i++) {
      if (props.activePlayers.length < 1) return;
      document.getElementById(`${i}${i}`).style.position = 'absolute';
      document.getElementById(`${i}${i}`).style.left =
        document.getElementById(`${i}`).offsetLeft + 'px';
      document.getElementById(`${i}${i}`).style.top =
        document.getElementById(`${i}`).offsetTop + 'px';
    }
  }, [peers.length, props.activePlayers.length]);

  useEffect(() => {
    socketRef.current = io.connect('https://server-zw.herokuapp.com/');
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join room', roomID);
        socketRef.current.on('all users', (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on('user joined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div className='players'>
      <video
        playsInline
        muted
        ref={userVideo}
        autoPlay
        className='avators av-top'
        id='0'
      />

      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} pos={index + 1} />;
      })}
      {props.activePlayers.map((playerId, index) => (
        <div
          className={`glow av-bot ${glow(playerId)}`}
          id={`${index}${index}`}
          key={index}
        />
      ))}
    </div>
  );
};

export default Players_component;
