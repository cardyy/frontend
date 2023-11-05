import React, { useState } from 'react'
import './Leaderboard.css' // Assuming you save the CSS in Leaderboard.css

const Leaderboard = () => {
  // Sample data for the leaderboard
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: 'Player 1',
      points: 100,
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 2,
      name: 'Player 2',
      points: 85,
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 3,
      name: 'Player 3',
      points: 80,
      avatar: 'https://via.placeholder.com/50',
    },
    // ... more players
  ])

  // Function to handle player selection from the leaderboard
  const handlePlayerClick = (playerId) => {
    console.log(`Player selected: ${playerId}`)
    // Additional logic for clicking a player can go here
  }

  return (
    <div className="w3-modal-content w3-animate-opacity">
      <div className="w3-container">
        <h2>Leaderboard</h2>
        <div className="leaderboard-container">
          {players
            .sort((a, b) => b.points - a.points) // Sort players by points
            .map((player, index) => (
              <div
                key={player.id}
                className="player-entry"
                onClick={() => handlePlayerClick(player.id)}
              >
                <div className="player-avatar">
                  <img src={player.avatar} alt="avatar" />
                </div>
                <div className="player-info">
                  <span className="player-rank">{index + 1}</span>
                  <span className="player-name">{player.name}</span>
                  <span className="player-points">{player.points} pts</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
