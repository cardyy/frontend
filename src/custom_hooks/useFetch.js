import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function UseFetch() {
  const [roomId, setRoomId] = useState(null);
  const [myID, setmyID] = useState(null);
  const [gameData, setGameData] = useState([]);
  const [activePlayers, setActivePlayers] = useState([]);
  const [rest, setRest] = useState([]);
  const [numPlayers, setNumPlayers] = useState(0);
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

  const createRoom = (num_players, game_type) => {
    const id = Math.random().toString(36).substr(2, 4);
    const room = game_type + id;
    if (myID) return;
    localStorage.setItem('myId', id);
    localStorage.setItem('roomId', room);
    socketRef.current.emit('create_game', { room, id, num_players });
    setClickEvent((x) => {
      return !x;
    });
  };

  const joinRoom = (x) => {
    const id = Math.random().toString(36).substr(2, 4);
    const room = x;
    if (myID) return;
    let myPromise = new Promise((myResolve) => {
      socketRef.current.emit('join_game', { room, id });
      myResolve();
    });

    myPromise.then(() => {
      socketRef.current.on(`${id}`, (msg) => {
        alert(msg);
      });
    });

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
    socketRef.current.emit('server_connect', roomId);
    socketRef.current.on('rest-of-world', (rest_of_world) => {
      setRest(rest_of_world);
    });

    if (!roomId) return;
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
        setNumPlayers(data.playersAllowed);
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
    activePlayers,
    activePlayer,
    numPlayers,
    centerDeck,
    deck,
    socketRef,
    gameData,
    setMessage,
    setNext,
    rest,
    next,
    hadDeclared,
    setHadDeclared,
    setClickEvent,
    clickEvent,
  };
}
