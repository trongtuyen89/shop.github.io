const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public')); // Cho phép hiển thị trang chủ nếu đặt frontend ở backend
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  const { name, price, zalo, password } = req.body;

  const correctPassword = 'admin123'; // 🔒 Đổi mật khẩu tại đây
  if (password !== correctPassword) {
    return res.status(403).send('❌ Mật khẩu sai! Không được phép đăng.');
  }

  const cover = req.files['cover']?.[0]?.path || '';
  const images = (req.files['images'] || []).map(file => file.path);

  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  data.push({ name, price: parseInt(price), zalo, cover, images });
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

  res.send('✅ Đăng sản phẩm thành công!');
});

app.get('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  res.json(data);
});

app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
