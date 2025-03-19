// api/upload.js
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// 设置文件存储方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 存储位置
    const uploadDir = './public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 设置文件名，防止文件重名
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 处理图片上传
export default (req, res) => {
  if (req.method === 'POST') {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ error: '上传失败' });
      }

      const filePath = `uploads/${req.file.filename}`;
      res.status(200).json({ message: '上传成功', filePath });
    });
  }
};
