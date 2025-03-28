import React, { useState, useEffect } from 'react'; 
import { supabase } from '../supabaseClient';  // 导入已创建的 supabase 实例
import moment from 'moment-timezone';  // 导入 moment-timezone
import '../css/Guestbook.css';
import gif from '../assets/chiikawa gif1.gif';

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

        // 使用 moment-timezone 将每个留言的时间转换为北京时间
        const formattedMessages = data.map((msg) => {
          const beijingTime = moment.utc(msg.time).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'); // 转换为北京时间
          return {
            ...msg,
            time: beijingTime, // 将时间更新为北京时区
          };
        });

        setMessages(formattedMessages || []);
      } catch (error) {
        setError('加载留言失败');
      }
      setLoading(false);  // ✅ 确保最终会执行
    };

    fetchMessages();

    // 监听新留言
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prevMessages) => [payload.new, ...prevMessages]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);  // 组件卸载时取消订阅
    };
  }, []);

  // 提交留言
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // 获取当前时间并转换为 UTC 格式
    const newMessage = { 
      author, 
      text: message, 
      time: moment().toISOString() // 存储为 UTC 格式
    };

    setLoading(true);
    try {
      let { data, error } = await supabase.from('messages').insert([newMessage]).select(); // ✅ 确保返回数据
      if (error) throw error;
      setMessage('');  // 清空输入框
      setError('');
    } catch (error) {
      setError('提交失败，请稍后再试');
    }
    setLoading(false);
  };

  return (
    <div className="guestbook-wrapper">
      {/* 添加GIF，放在整个留言板容器上方 */}
      <div className="gif-container">
        <img 
          src={gif}  // 替换成你自己的GIF路径
          alt="gif"
          className="gif"
        />
      </div>

      <div className="guestbook-container">
        <h2>这里是我们，只有我们</h2>

        {/* 错误消息 */}
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
              {loading ? '提交中...' : '亲爱的，轻轻点击这里写下'}
            </button>
          </div>
        </form>

        {/* 显示留言 */}
        <div className="messages">
          {messages.length === 0 ? (
            <p>没有留言</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.author}`}>
                <p className="author">{msg.author === 'you' ? '西西' : '卜卜'}</p>
                <p className="text">{msg.text}</p>
                <p className="time">{msg.time}</p> {/* 显示已转换的时间 */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
