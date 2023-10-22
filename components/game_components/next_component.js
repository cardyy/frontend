import React from 'react';
import nextSound from '../../assets/audio/next.m4a';
import nextImage from '../../assets/next.png';  // Consider importing the image for better error handling.

export default function Next_component({socket, next, setClickEvent}) {  // Destructuring for cleaner reference

  // At the top of your file
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// When playing the audio
async function playAudio() {
  try {
    // Check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    const audio = new Audio(nextSound);
    audio.src = nextSound;  // Ensure the source is set correctly.
    audio.load();  // Sometimes necessary to reload the source.
    
    // Now, we're ensuring the audio plays via the audio context
    const track = audioContext.createMediaElementSource(audio);
    track.connect(audioContext.destination);

    await audio.play();  // Play the audio.
  } catch (err) {
    console.error('Failed to play:', err);
  }
}

  const nextAction = async () => {  // Reflecting the async nature of the actions here
    const room = localStorage.getItem('roomId');
    const id = localStorage.getItem('myId');
    const credentials = {
      room,
      id,
    };
    
    await playAudio();  // Since this is an async action, we'll await it.

    socket.current.emit('next', credentials);
    next(false);
    setClickEvent(prevClickEvent => !prevClickEvent);  // Slightly cleaner syntax.
  };

  return (
    <div>
      <img
        src={nextImage}  // Directly using the imported image ensures the path is correct.
        alt="Go to the next item"  // A more descriptive alt attribute.
        className='next'
        onClick={nextAction}  // Renamed for clarity.
      />
    </div>
  );
}
