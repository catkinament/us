import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../css/Guestbook.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState('me');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 加载留言
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      let { data, error } = await supabase.from('messages').select('*').order('time', { ascending: false });
      if (error) setError('加载留言失败');
      else setMessages(data);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  // 提交留言
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = { author, text: message, time: new Date().toISOString() };

    setLoading(true);
    let { data, error } = await supabase.from('messages').insert([newMessage]);

    if (error) setError('提交失败');
    else setMessages([data[0], ...messages]); // 插入到顶部

    setMessage('');
    setLoading(false);
  };

  // 删除留言
  const handleDelete = async (id) => {
    if (window.confirm('确定删除？')) {
      setLoading(true);
      let { error } = await supabase.from('messages').delete().eq('id', id);
      if (!error) setMessages(messages.filter((msg) => msg.id !== id));
      setLoading(false);
    }
  };

  return (
    <div className="guestbook-container">
      <h2>这里是我们，只有我们</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="guestbook-form">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="要说些什么呢"></textarea>
        <div className="form-controls">
          <select value={author} onChange={(e) => setAuthor(e.target.value)}>
            <option value="you">西西</option>
            <option value="me">卜卜</option>
          </select>
          <button type="submit" disabled={loading}>{loading ? '提交中...' : '写下留言'}</button>
        </div>
      </form>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <p className="author">{msg.author === 'you' ? '西西' : '卜卜'}</p>
            <p className="text">{msg.text}</p>
            <p className="time">{new Date(msg.time).toLocaleString()}</p>
            <button onClick={() => handleDelete(msg.id)}>删除</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guestbook;
