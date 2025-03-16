import React, { useState, useEffect } from 'react';
import '../css/Guestbook.css';

const API_URL = process.env.REACT_APP_API_URL;  // 后端API地址

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('me');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 加载状态

  // 通用的请求函数
  const fetchData = async (url, options = {}) => {
    setLoading(true);  // 开始加载
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('请求失败');
      return await res.json();
    } catch (error) {
      console.error(error);
      setError('请求失败，请稍后再试');
    } finally {
      setLoading(false);  // 完成加载
    }
  };

  // 从后端获取留言
  useEffect(() => {
    const fetchMessages = async () => {
      const data = await fetchData(`${API_URL}/messages`);
      if (data) setMessages(data);
    };
    fetchMessages();
  }, []);  // 只在初次渲染时加载

  // 提交留言
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      author,
      time: new Date().toLocaleString(),
    };

    const addedMessage = await fetchData(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage),
    });

    if (addedMessage) {
      setMessages((prevMessages) => [...prevMessages, addedMessage]);
      setMessage('');
      setError('');
    }
  };

  const getAuthorName = (author) => {
    const authors = { me: '卜卜', you: '西西' };
    return authors[author] || '匿名';
  };

  // 删除单个留言
  const handleDeleteMessage = async (index) => {
    const messageToDelete = messages[index];
    if (window.confirm('确定删除这条留言吗？')) {
      await fetchData(`${API_URL}/messages/${messageToDelete.id}`, {
        method: 'DELETE',
      });
      setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    }
  };

  // 清空所有留言
  const handleClearMessages = async () => {
    if (window.confirm('确定清空所有留言吗？')) {
      await fetchData(`${API_URL}/messages`, { method: 'DELETE' });
      setMessages([]);
    }
  };

  return (
    <div className="guestbook-container">
      <h2>这里是我们，只有我们</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="guestbook-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="要说些什么呢"
        ></textarea>
        <div className="form-controls">
          <select value={author} onChange={(e) => setAuthor(e.target.value)}>
            <option value="you">西西</option>
            <option value="me">卜卜</option>
          </select>
          <button type="submit" disabled={loading}>
            亲爱的，请在这里写下
          </button>
        </div>
      </form>

      <div className="messages">
        {loading ? (
          <p>加载中...</p>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`message ${msg.author === 'me' ? 'left' : 'right'}`}
            >
              <p className="author">{getAuthorName(msg.author)}</p>
              <p className="text">{msg.text}</p>
              <p className="time">{msg.time}</p>
              <button onClick={() => handleDeleteMessage(index)}>删除</button>
            </div>
          ))
        ) : (
          <p>暂无留言</p>
        )}
      </div>

      <button onClick={handleClearMessages} className="clear-button" disabled={loading}>
        清空所有留言
      </button>
    </div>
  );
};

export default Guestbook;
