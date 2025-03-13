// src/components/Guestbook.js
import React, { useState } from 'react';

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>这里是我们，只有我们</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="要说些什么呢"
        ></textarea>
        <button type="submit">亲爱的，请在这里写下</button>
      </form>
      <div className="messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => <p key={index}>{msg}</p>)
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};

export default Guestbook;
