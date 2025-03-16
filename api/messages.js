// api/messages.js
import { v4 as uuidv4 } from 'uuid';

let messages = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // 返回所有留言
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    // 提交新留言
    const { text, author } = req.body;

    // 验证留言内容和作者是否有效
    if (!text || !author) {
      return res.status(400).json({ error: '留言内容和作者不能为空' });
    }

    const newMessage = {
      id: uuidv4(),
      text,
      author,
      time: new Date().toLocaleString(),
    };

    messages.push(newMessage);
    res.status(201).json(newMessage);
  } else if (req.method === 'DELETE') {
    // 删除所有留言
    messages = [];
    res.status(200).json({ message: '所有留言已删除' });
  } else {
    // 处理其他不支持的 HTTP 方法
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
