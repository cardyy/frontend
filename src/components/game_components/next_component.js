import React from 'react';
import nextSound from '../../assets/audio/next.mp3';
import nextImage from '../../assets/next.png';
import { Howl } from 'howler';

export default function Next_component({ socket, next, setClickEvent }) {
  // We're using Howler for audio because it handles a lot of cross-browser
  // and cross-device issues for us. Create a Howl instance for our sound.
  const sound = new Howl({
    src: [nextSound],
    preload: true, // Preload the sound for better performance.
    html5: true, // Use HTML5 Audio API for wider device compatibility, especially on mobile.
  });

  // Function to handle the actual audio playing
  const playAudio = async () => {
    try {
      // Attempt to play the sound.
      const soundId = sound.play();

      // If you want to do more with the sound, you can reference it with the soundId, e.g., control volume, etc.
    } catch (err) {
      console.error('Failed to play the sound:', err);
    }
  };

  // Function to handle the "next" action.
  const nextAction = async () => {
    try {
      // Play the audio first; wait for it to finish if necessary.
      await playAudio();

      // Get the room and ID from localStorage.
      const room = localStorage.getItem('roomId');
      const id = localStorage.getItem('myId');

      // Build the credentials object.
      const credentials = {
        room,
        id,
      };

      // Communicate with the server.
      socket.current.emit('next', credentials);

      // Update state and UI components.
      next(false);
      setClickEvent((prevClickEvent) => !prevClickEvent);

    } catch (error) {
      console.error('Error during next action:', error);
    }
  };

  return (
    <div>
      <img
        src={nextImage}
        alt="Next"
        className="next"
        onClick={nextAction} // Direct interaction starts audio playback, respecting browser restrictions.
      />
    </div>
  );
}
