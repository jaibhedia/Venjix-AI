import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = ({ onSend, isEnabled }) => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom every time the chat history updates
  }, [chatHistory]);

  const handleSend = async () => {
    if (input.trim() && isEnabled) {  // Ensure this only works when enabled
      const userMessage = { sender: 'user', text: input };
      setChatHistory((prevHistory) => [...prevHistory, userMessage]);

      const response = await onSend(input);
      const botMessage = { sender: 'bot', text: response };
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);

      setInput('');  // Clear input
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
          disabled={!isEnabled}  // Disabled based on isEnabled prop
        />
        <button onClick={handleSend} disabled={!isEnabled}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
