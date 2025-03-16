// api/upload.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// 配置 API 以禁用默认的 body 解析
export const config = {
  api: {
    bodyParser: false,  // 禁用默认的 body 解析器
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), '/public/images'); // 图片存放目录

    // 检查目录是否存在，如果不存在则创建
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.uploadDir = uploadDir; // 设置上传路径
    form.keepExtensions = true;  // 保持扩展名

    // 仅允许图片上传
    form.on('file', (field, file) => {
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: '只能上传图片文件' });
      }
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: '上传失败' });
      }

      // 检查是否上传了文件
      if (!files.image || files.image.length === 0) {
        return res.status(400).json({ error: '没有上传文件' });
      }

      const filePath = files.image[0].filepath; // 获取文件路径
      const fileName = files.image[0].newFilename; // 获取新的文件名
      res.status(200).json({ message: '上传成功', filePath: `/images/${fileName}` });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
