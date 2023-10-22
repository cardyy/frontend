import React from 'react';
import nextSound from '../../assets/audio/next.m4a';
import nextImage from '../../assets/next.png';  // Consider importing the image for better error handling.

export default function Next_component({socket, next, setClickEvent}) {  // Destructuring for cleaner reference
  async function playAudio() {  // Using async/await syntax for cleaner reads
    const audio = new Audio(nextSound);
    try {
      await audio.play();
      // Automatic playback started!
    } catch (error) {
      // Auto-play was prevented, or there were some other issues.
      console.error("Playback failed.", error);
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
