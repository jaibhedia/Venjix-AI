import React, { useState, useEffect } from 'react';
import './Orb.css';
import staticNoise from './audio/start.wav';
import introSound from './audio/venjix.mp3';

function Orb() {
  const [isOn, setIsOn] = useState(false);

  const handleActivation = () => {
    if (!isOn) {
      setIsOn(true);

      // Play static noise
      const staticAudio = new Audio(staticNoise);
      staticAudio.play();

      // After static noise, play the intro sound
      staticAudio.onended = () => {
        const introAudio = new Audio(introSound);
        introAudio.play();
      };
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleActivation();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOn]); // Dependency array includes isOn to ensure it only activates if not already on

  return (
    <div className="orb-container" onClick={handleActivation}>
      <div className={`orb ${isOn ? 'orb-on' : 'orb-off'}`}></div>
    </div>
  );
}

export default Orb;
