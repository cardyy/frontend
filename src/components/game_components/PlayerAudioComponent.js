import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer"; // A simple library to work with WebRTC.
import io from "socket.io-client"; // Real-time library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

const PlayerAudioComponent = ({ roomID, playerId, id }) => {
  // Assuming you want to use a room-based system
  const [isMuted, setIsMuted] = useState(false);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const audioRef = useRef();
  const peersRef = useRef([]);
  const [userAudioEnabled, setUserAudioEnabled] = useState(true);

  useEffect(() => {
    // Connect to the signaling server (socket.io server)
    socketRef.current = io.connect(
      "https://crazy-eights-f5fce4747505.herokuapp.com",
    );

    // Request access to the user's audio
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioRef.current.srcObject = stream;

      // Join a room
      socketRef.current.emit("join room", roomID);

      socketRef.current.on("all users", (users) => {
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

      socketRef.current.on("user joined", (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });

        setPeers((users) => [...users, peer]);
      });

      socketRef.current.on("receiving returned signal", (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });

      socketRef.current.on("user left", (id) => {
        setPeers((prevPeers) => {
          const updatedPeers = new Map(prevPeers);
          updatedPeers.delete(id);
          return updatedPeers;
        });
      });

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = userAudioEnabled;
      }
    });

    function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
      });

      peer.on("signal", (signal) => {
        socketRef.current.emit("sending signal", {
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
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
      });

      peer.on("signal", (signal) => {
        socketRef.current.emit("returning signal", { signal, callerID });
      });

      peer.signal(incomingSignal);

      return peer;
    }

    // Cleanup
    return () => {
      socketRef.current.disconnect();
      peersRef.current.forEach(({ peer }) => peer.destroy());
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomID]);
  

  const handleMuteToggle = () => {
    setUserAudioEnabled((prevEnabled) => {
      const newEnabledState = !prevEnabled;

      // Get our own stream and update it.
      if (audioRef.current && audioRef.current.srcObject) {
        const audioTracks = audioRef.current.srcObject.getAudioTracks();
        if (audioTracks.length > 0) {
          // Enable or disable the track depending on the new state.
          audioTracks[0].enabled = newEnabledState;
        }
      }

      // Update the mute state.
      setIsMuted(!newEnabledState);
      return newEnabledState;
    });
  };

  return (
    <>
      <div className="player-audio">
      <audio ref={audioRef} autoPlay playsInline muted/>
        <button
          onClick={handleMuteToggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "10px",
            color: "white",
          }}
        >
          {isMuted ? (
            <FontAwesomeIcon icon={faMicrophoneSlash} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} size="2x" />
          )}
        </button>
      </div>
      {peers.map((peer, index) => {
        return <Audio key={index} peer={peer} />;
      })}
    </>
  );
};


const Audio = ({ peer, isMuted }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
      // Here, you could also adjust the audio track enabled/disabled state based on `isMuted`.
    });
  }, [peer, isMuted]); // Make sure to react to changes of isMuted.

  // Adjust audio element based on mute state.
  return <audio playsInline autoPlay ref={ref} />;
};

export default PlayerAudioComponent;
