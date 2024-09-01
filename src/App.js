import React, { useState } from 'react';
import Orb from './Orb';
import ChatBox from './ChatBox';
import './App.css';

function App() {
  const [isRaging, setIsRaging] = useState(false);

  const handleSend = async (query) => {
    const response = getHardcodedResponse(query);
    if (response.toLowerCase().includes('rage')) {
      setIsRaging(true);
    } else {
      setIsRaging(false);
    }

    // Convert the response to Venjix's voice using text-to-speech
    speakWithVenjixVoice(response);

    return response;
  };

  const getHardcodedResponse = (query) => {
    const lowerCaseQuery = query.toLowerCase();

    if (lowerCaseQuery.includes('hello')) {
      return 'Hello! How can I assist you today?';
    } else if (lowerCaseQuery.includes('what is your name')) {
      return 'I am Venjix, the most advanced AI.';
    } else if (lowerCaseQuery.includes('rage')) {
      return 'I am feeling enraged!';
    } else {
      return 'Sorry, I didn\'t understand that. Can you please rephrase?';
    }
  };

  const speakWithVenjixVoice = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Customize the voice settings to mimic Venjix
    const voices = window.speechSynthesis.getVoices();
    // Select a deep male voice; you might need to experiment with available voices in your browser
    const venjixVoice = voices.find(voice => voice.name.includes('Google UK English Male')) || voices[0];
    utterance.voice = venjixVoice;
    utterance.pitch = 0.5;  // Lower pitch for a deeper voice
    utterance.rate = 0.85;  // Slower rate to match Venjix's deliberate speech
    utterance.volume = 1.0; // Full volume

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="App">
      <Orb isRaging={isRaging} />
      <ChatBox onSend={handleSend} />
    </div>
  );
}

export default App;
