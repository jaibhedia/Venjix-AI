import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';

const ChatBox = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setChatHistory([...chatHistory, userMessage]);

      const response = await onSend(input);
      const botMessage = { sender: 'bot', text: response };
      setChatHistory((prevHistory) => [...prevHistory, botMessage]);

      setInput('');
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
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
