import React, { useState } from 'react';
import Orb from './Orb';
import ChatBox from './ChatBox';
import axios from 'axios';  // Import axios
import './App.css';

function App() {
  const [isRaging, setIsRaging] = useState(false);
  const [isOrbOn, setIsOrbOn] = useState(false);  // Track if the orb is turned on

  const handleSend = async (query) => {
    let response = '';

    if (isOrbOn) {
      try {
        response = await getAIResponse(query);
      } catch (error) {
        console.error('Error with OpenAI API:', error);
        response = 'Sorry, something went wrong. Please try again.';
      }

      if (response.toLowerCase().includes('rage')) {
        setIsRaging(true);
      } else {
        setIsRaging(false);
      }

      // Convert the response to Venjix's voice using text-to-speech
      speakWithVenjixVoice(response);
    } else {
      response = 'The orb is off. Please turn it on to interact.';
    }

    return response;
  };

  const getAIResponse = async (query) => {
    const apiKey = 'your-openai-api-key';  // Replace with your actual OpenAI API key

    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: query }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return openAIResponse.data.choices[0].message.content.trim();
  };

  const speakWithVenjixVoice = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Customize the voice settings to mimic Venjix
    const voices = window.speechSynthesis.getVoices();
    const venjixVoice = voices.find(voice => voice.name.includes('Google UK English Male')) || voices[0];
    utterance.voice = venjixVoice;
    utterance.pitch = 0.5;  // Lower pitch for a deeper voice
    utterance.rate = 0.85;  // Slower rate to match Venjix's deliberate speech
    utterance.volume = 1.0; // Full volume

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  const toggleOrb = () => {
    setIsOrbOn(prevState => {
      const newState = !prevState;
      console.log('Orb state:', newState);  // Log the new state
      return newState;
    });
    setIsRaging(false);  // Reset the raging state when toggling
  };
  
  return (
    <div className="App">
      <Orb isRaging={isRaging} onToggle={toggleOrb} />
      <ChatBox onSend={handleSend} isEnabled={isOrbOn} />
    </div>
  );
}

export default App;
