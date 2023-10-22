import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer'; // A simple library to work with WebRTC.
import io from 'socket.io-client'; // Real-time library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

const PlayerAudioComponent = ({ roomID,playerId,id }) => { // Assuming you want to use a room-based system
  const [isMuted, setIsMuted] = useState(false);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const audioRef = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    // Connect to the signaling server (socket.io server)
    socketRef.current = io.connect('https://crazy-eights-f5fce4747505.herokuapp.com');

    // Request access to the user's audio
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioRef.current.srcObject = stream;

        // Join a room
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

          setPeers(users => [...users, peer]);
        });

        socketRef.current.on('receiving returned signal', (payload) => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on('user left', (id) => {
          const peerObj = peersRef.current.find(p => p.peerID === id);
          if(peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(p => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });
      });

    function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
      });

      peer.on('signal', signal => {
        socketRef.current.emit('sending signal', { userToSignal, callerID, signal });
      });

      return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on('signal', signal => {
        socketRef.current.emit('returning signal', { signal, callerID });
      });

      peer.signal(incomingSignal);

      return peer;
    }

    // Cleanup
    return () => {
      peersRef.current.forEach(({ peer }) => peer.destroy());
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

 
  const handleMuteToggle = () => {
    const enabled = audioRef.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      audioRef.current.srcObject.getAudioTracks()[0].enabled = false;
      setIsMuted(true);
    } else {
      audioRef.current.srcObject.getAudioTracks()[0].enabled = true;
      setIsMuted(false);
    }
  };


  return (
    <>
      <div className="player-audio">
        <audio ref={audioRef} autoPlay playsInline></audio>
        {playerId === id && (<button onClick={handleMuteToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', color: 'white' }}>
          {isMuted ? (
            <FontAwesomeIcon icon={faMicrophoneSlash} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} size="2x" />
          )}
        </button>)}
      </div>
      {peers.map((peer) => {
        return (
          <Audio key={peer.id} peer={peer} />
        );
      })}
    </>
  );
};

const Audio = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <audio playsInline autoPlay ref={ref} />;
};

export default PlayerAudioComponent;