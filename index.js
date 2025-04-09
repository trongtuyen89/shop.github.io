const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express(); // ✅ Dòng này rất quan trọng!
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ⚠️ Không được khai báo app.post trước dòng trên!

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

  const correctPassword = '2802';
  if (password !== correctPassword) {
    return res.status(403).send('❌ Mật khẩu sai! Không được phép đăng.');
  }

  try {
    const cover = req.files['cover']?.[0]?.path || '';
    const images = (req.files['images'] || []).map(file => file.path);

    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    data.push({ name, price: parseInt(price), zalo, cover, images });
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

    res.send('✅ Đăng sản phẩm thành công!');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Lỗi server khi xử lý đăng sản phẩm.');
  }
});

app.get('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  res.json(data);
});

app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
