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
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
    try {
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
    } catch (error) {
      console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const splitTextIntoChunks = (text, chunkSize) => {
    const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
    return text.match(regex);
  };

  const speakWithVenjixVoice = (text) => {
    window.speechSynthesis.cancel();  // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    const venjixVoice = voices.find(voice => voice.name.includes('Google UK English Male')) || voices[0];
    utterance.voice = venjixVoice;
    utterance.pitch = 0.5;  // Lower pitch for a deeper voice
    utterance.rate = 0.85;  // Slower rate to match Venjix's deliberate speech
    utterance.volume = 1.0; // Full volume

    const chunks = splitTextIntoChunks(text, 150);

    chunks.forEach((chunk, index) => {
      setTimeout(() => {
        utterance.text = chunk;
        window.speechSynthesis.speak(utterance);
      }, index * 2000);  // 2-second delay between chunks
    });

    utterance.onend = () => console.log('Speech finished');
    utterance.onerror = (event) => console.error('SpeechSynthesis error:', event.error);
  };

  return (
    <div className="App">
      <Orb isRaging={isRaging} />
      <ChatBox onSend={handleSend} /> {/* ChatBox is always enabled */}
    </div>
  );
}

export default App;
