import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null); // Reference to the bottom of the chat

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom every time the chat history updates
  }, [chatHistory]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setChatHistory([...chatHistory, userMessage]);

      const response = await onSend(input); // Get the AI response
      const botMessage = { sender: 'bot', text: response };
      setChatHistory((prevHistory) => [...prevHistory, userMessage, botMessage]);

      setInput(''); // Clear the input after sending
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
        <div ref={chatEndRef} /> {/* Empty div to scroll to */}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your query..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
