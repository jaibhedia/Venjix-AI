import React, { useState } from 'react';
import Orb from './Orb';
import ChatBox from './ChatBox';
import axios from 'axios';
import './App.css';

function App() {
  const [isRaging, setIsRaging] = useState(false);

  const handleSend = async (query) => {
    let response = '';

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

  return (
    <div className="App">
      <Orb isRaging={isRaging} />
      <ChatBox onSend={handleSend} /> {/* ChatBox is always enabled */}
    </div>
  );
}

export default App;
