// src/components/Guestbook.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';  // 导入已创建的 supabase 实例
import '../css/Guestbook.css';

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
      try {
        let { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('time', { ascending: false });

        if (error) throw error;

        // 确保 data 不为空
        if (data && Array.isArray(data)) {
          setMessages(data);
        } else {
          setError('没有找到留言');
        }
      } catch (error) {
        setError('加载留言失败');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // 提交留言
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = { author, text: message, time: new Date().toISOString() };

    setLoading(true);
    try {
      let { data, error } = await supabase.from('messages').insert([newMessage]);
      if (error) throw error;
      setMessages((prevMessages) => [data[0], ...prevMessages]);
      setMessage('');
      setError(''); // 提交成功后清除错误
    } catch (error) {
      setError('提交失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guestbook-container">
      <h2>这里是我们，只有我们</h2>
      {error && <p className="error-message">{error}</p>}

      {/* 提交留言表单 */}
      <form onSubmit={handleSubmit} className="guestbook-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="要说些什么呢"
          disabled={loading}
        />
        <div className="form-controls">
          <select value={author} onChange={(e) => setAuthor(e.target.value)} disabled={loading}>
            <option value="you">西西</option>
            <option value="me">卜卜</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? '提交中...' : '写下留言'}
          </button>
        </div>
      </form>

      {/* 显示留言 */}
      <div className="messages">
        {messages.length === 0 ? (
          <p>暂无留言</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <p className="author">{msg.author === 'you' ? '西西' : '卜卜'}</p>
              <p className="text">{msg.text}</p>
              <p className="time">{new Date(msg.time).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Guestbook;
