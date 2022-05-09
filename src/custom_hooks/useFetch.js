import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function UseFetch() {
  const [roomId, setRoomId] = useState(null);
  const [myID, setmyID] = useState(null);
  const [gameData, setGameData] = useState([]);
  const [activePlayers, setActivePlayers] = useState([]);
  const [activePlayer, setActivePlayer] = useState('');
  const [gameStarted, setGameStarted] = useState(true);
  const [centerDeck, setCenterDeck] = useState([]);
  const [message, setMessage] = useState('');
  const [clickEvent, setClickEvent] = useState(false);
  const [hasData, setHasData] = useState(0);
  const [myHand, setMyHand] = useState([]);
  const [deck, setDeck] = useState(0);
  const [next, setNext] = useState(false);
  const [hadDeclared, setHadDeclared] = useState(false);
  const socketRef = useRef();

  const createRoom = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const room = '4';
    if (myID) return;
    localStorage.setItem('myId', id);
    localStorage.setItem('roomId', room);
    socketRef.current.emit('create_game', { room, id });
    setClickEvent((x) => {
      return !x;
    });
  };

  const joinRoom = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const room = '4';
    if (myID) return;
    socketRef.current.emit('join_game', { room, id });
    localStorage.setItem('myId', id);
    localStorage.setItem('roomId', room);
    setClickEvent((x) => {
      return !x;
    });
  };

  const leaveRoom = () => {
    const room = localStorage.getItem('roomId');
    const id = localStorage.getItem('myId');
    socketRef.current.emit('leave_room', { room, id });
    localStorage.clear();
    setClickEvent((x) => {
      return !x;
    });
  };

  useEffect(() => {
    socketRef.current = io.connect('/');
    const id = localStorage.getItem('myId');
    const room = localStorage.getItem('roomId');
    setRoomId(room);
    setmyID(id);
    !gameStarted && setMessage('Waiting for other players to join...');

    if (!roomId) return;
    socketRef.current.emit('server_connect', roomId);

    socketRef.current.on(`${roomId}`, (gameData) => {
      const data = gameData;
      if (
        data == null ||
        data.players.find((x) => x.id === myID) === undefined
      ) {
        localStorage.clear();
      } else {
        data.players.length > 0 ? setGameStarted(true) : setGameStarted(false);
        const myPersonalData = data.players.find(
          (player) => player.id === myID
        );
        if (myPersonalData) {
          if (myPersonalData.nhonga !== 0) {
            setMessage(
              `You have just been told to pick ${myPersonalData.nhonga}! You need to counter or pick`
            );
            setTimeout(() => {
              setMessage(null);
            }, 3000);
          }
          let myVar;
          if (myPersonalData.skip === 'yes') {
            setMessage('You have just been skipped you have 3 sec to counter');
            setTimeout(() => {
              setMessage(null);
            }, 3000);
            myVar = setTimeout(async () => {
              socketRef.current.emit('next', { roomId, myID });
            }, 3000);
            if (myPersonalData.skip === 'no') {
              clearTimeout(myVar);
            }
          }

          if (data.gameOver === 'yes') {
            setMessage('Game Over');
            setTimeout(() => {
              setMessage(null);
            }, 10000);
          }
          setMyHand(myPersonalData.playerHand);
        }

        setActivePlayer(data.activePlayer);
        setActivePlayers(
          data.players.map((x) => {
            return x.id;
          })
        );
        setCenterDeck(data.centerDeck);
        setHasData(data.length !== 0);
        setDeck(data.mainDeck.length);
        setGameData(data);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(gameData), clickEvent, roomId]);

  return {
    hasData,
    createRoom,
    myID,
    roomId,
    joinRoom,
    message,
    leaveRoom,
    myHand,
    activePlayer,
    activePlayers,
    centerDeck,
    deck,
    socketRef,
    gameData,
    setMessage,
    setNext,
    next,
    hadDeclared,
    setHadDeclared,
    setClickEvent,
    clickEvent,
  };
}
