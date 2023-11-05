import React from 'react'
import play from '../../../assets/audio/play.mp3'
import stop from '../../../assets/audio/stop.mp3'
import win from '../../../assets/audio/win.mp3'
import nhongesa from '../../../assets/audio/nhonga.mp3'
import block from '../../../assets/audio/block.mp3'
import declare from '../../../assets/audio/declare.mp3'
import './cards_component.css'

export default function Cards_component(props) {
  function playAudio(x) {
    if (x == 'play') {
      new Audio(play).play()
    } else if (x == 'stop') {
      new Audio(stop).play()
    } else if (x == 'win') {
      new Audio(win).play()
    } else if (x == 'nhongesa') {
      new Audio(nhongesa).play()
    } else if (x == 'block') {
      new Audio(block).play()
    } else if (x == 'declare') {
      new Audio(declare).play()
    }
  }
  const handleClick = (a) => {
    const id = localStorage.getItem('myId')
    const roomId = localStorage.getItem('roomId')
    const gameData = props.data
    let myPersonalData = gameData.players.find((item) => {
      return item.id === id
    })
    let topCard3
    let design
    const credentials = {
      room: roomId,
      id: id,
    }
    const b = {
      room: roomId,
      id: id,
      a: a,
      playagain: 'yes',
    }
    const c = {
      room: roomId,
      id: id,
      a: a,
      playagain: 'no',
    }
    let myHand = myPersonalData.playerHand
    let center = gameData.centerDeck
    let players = gameData.players
    let howMany = players.length
    let topCard = gameData.centerDeck[gameData.centerDeck.length - 1]
    let skip = myPersonalData.skip
    let declare = gameData.declare
    let badCards = ['3', '4', '5', '6', '9', 'T', 'Q']
    let amwe = ['2', '0', 'A']
    let nhonga = myPersonalData.nhonga
    let cant = myPersonalData.cant
    let gameOver = gameData.gameOver
    let activePlayer = gameData.activePlayer
    let myCard1 = a.slice(0, 1)
    let topCard1 = topCard.slice(0, 1)
    if (center.length > 1) {
      const secondLast = center.length - 2
      const secondTop = center[secondLast]
      topCard3 = secondTop.slice(0, 1)
    } else {
      topCard3 = 'R'
    }
    const ds = myHand.length
    const myCard2 = a.slice(1, 2)
    const topCard2 = topCard.slice(1, 2)

    if (declare !== '') {
      design = declare
    } else if (declare === '') {
      design = topCard2
    }

    let check = badCards.includes(myCard1)
    let ck = amwe.includes(topCard1)
    if (gameOver === 'no') {
      if (props.activePlayers < props.numPlayers) {
        props.message('Waiter for other players to join...')
        return
      }
      if (activePlayer === id) {
        if (cant === 'yes' && nhonga > 0) {
          if (
            (myCard1 === 'A' && topCard1 === '2') ||
            (myCard1 === 'A' && topCard1 === '0')
          ) {
            props.next(false)
            playAudio('block')
            props.socket.current.emit('block', c)
          }
        }
        if (
          (myCard1 === '8' &&
            topCard1 !== '8' &&
            skip === 'no' &&
            nhonga === 0) ||
          (myCard1 === '8' &&
            topCard1 === '8' &&
            skip === 'no' &&
            nhonga === 0 &&
            topCard3 === '8')
        ) {
          props.setHadDeclared(true)
          props.next(false)
          props.message('Which design do you want?')
          playAudio('declare')
          props.socket.current.emit('play', b)
        }

        if (
          (myCard1 === topCard1 && myCard1 !== '8') ||
          (myCard2 === design && myCard1 !== '8') ||
          myCard1 === '0' ||
          (myCard1 === '8' && topCard1 === '8' && topCard3 !== '8') ||
          topCard1 === '0' ||
          a === 'AS' ||
          topCard === 'AS'
        ) {
          if (check === true && ds === 1 && ck !== true) {
            props.next(false)
            props.socket.current.emit('play', c)
            playAudio('win')
            setTimeout(() => {
              props.socket.current.emit('gameOver', credentials)
            }, 2400)
          } else if (
            (myCard1 === '0' && skip === 'no' && cant === 'yes') ||
            (myCard1 === '2' && skip === 'no' && cant === 'yes')
          ) {
            props.next(false)
            playAudio('play')
            props.socket.current.emit('nhongesa', c)
          } else if (myCard1 === 'K' && skip === 'no' && nhonga === 0) {
            props.next(true)
            props.message(
              'K plays again! or press green next arrow to move to the next player'
            )
            setTimeout(() => {
              props.message(null)
            }, 4000)

            props.socket.current.emit('play', b)
          } else if (
            myCard1 === 'J' &&
            skip === 'no' &&
            nhonga === 0 &&
            howMany !== 2
          ) {
            props.next(false)
            playAudio('play')
            props.socket.current.emit('reverse', c)
          } else if (
            myCard1 === 'J' &&
            skip === 'no' &&
            nhonga === 0 &&
            howMany === 2
          ) {
            props.next(false)
            playAudio('play')
            props.socket.current.emit('play', b)
          } else if (
            myCard1 === '7' &&
            skip === 'no' &&
            nhonga === 0 &&
            howMany === 2
          ) {
            props.next(false)
            playAudio('play')
            props.socket.current.emit('play', b)
          } else if (
            myCard1 === '7' &&
            skip === 'yes' &&
            nhonga === 0 &&
            howMany !== 2
          ) {
            playAudio('play')
            props.next(false)
            props.socket.current.emit('play', c)
          } else if (
            myCard1 === '7' &&
            skip === 'no' &&
            nhonga === 0 &&
            howMany !== 2
          ) {
            playAudio('play')
            props.next(false)
            props.socket.current.emit('skip', c)
          } else if (
            skip === 'no' &&
            nhonga === 0 &&
            myCard1 !== '0' &&
            myCard1 !== '2'
          ) {
            playAudio('play')
            props.next(false)
            props.socket.current.emit('play', c)
          }
        } else {
          props.message('Not a matching suit!')
          playAudio('stop')
          setTimeout(() => {
            props.message(null)
          }, 1000)
        }
      } else {
        props.message('Chimbomira! its not your turn yet...')
        playAudio('stop')
        setTimeout(() => {
          props.message(null)
        }, 1000)
      }
      props.setClickEvent((x) => {
        return !x
      })
    }
  }
  return (
    <div className="footer">
      {props.myHand.map((card, index) => (
        <img
          src={require(`../../../assets/cards/${card}.png`)}
          alt=""
          key={index}
          className="card img"
          onClick={() => handleClick(card)}
        />
      ))}
    </div>
  )
}
