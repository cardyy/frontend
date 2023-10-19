import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
      ref.current.play().catch(console.error); // Handling the case where autoplay was prevented.
    });
  }, [props.peer]);
  
  return (
    <video playsInline ref={ref} autoPlay className='avators av-top' id={`${props.pos}`} />
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
      if (
        props.activePlayers.length < 1 ||
        document.getElementById(`${i}`) === null
      )
        return;
      document.getElementById(`${i}${i}`).style.position = 'absolute';
      document.getElementById(`${i}${i}`).style.display = 'block';
      document.getElementById(`${i}${i}`).style.left =
        document.getElementById(`${i}`).offsetLeft + 'px';
      document.getElementById(`${i}${i}`).style.top =
        document.getElementById(`${i}`).offsetTop + 'px';
    }
  }, []);

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:8000');
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join room', roomID);
        socketRef.current.on('all users', (users) => {
          console.log('users', users)
          const peers = [];
          console.log('my peer', users)
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            console.log('my peer', peer)
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peerID: userID,
              peer,
            });
          });
          setPeers(peers);
        });

        socketRef.current.on('user joined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          const peerObj = {
            peer,
            peerID: payload.callerID,
          };

          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on('user left', (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
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

      {peers
        .filter(
          (v, i, a) => a.findLastIndex((v2) => v2.peerID === v.peerID) === i
        )
        .map((peer, index) => {
          return (
            <Video
              key={peer.peerID}
              peer={peer.peer}
              pos={() => {
                return index + 1;
              }}
            />
          );
        })}
      {props.activePlayers.map((playerId, index) => (
        <div className={`av-bot glow`} id={`${index}${index}`} key={index} />
      ))}
    </div>
  );
};

export default Players_component;
