const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Tạo thư mục nếu chưa có
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('data.json')) fs.writeFileSync('data.json', '[]');

// Cấu hình Multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// API /upload
app.post('/upload', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  const { name, price, zalo, password } = req.body;

  if (password !== '2802') {
    return res.status(403).send('Sai mật khẩu');
  }

  const cover = req.files['cover']?.[0]?.path || '';
  const images = (req.files['images'] || []).map(img => img.path);

  const newProduct = {
    name,
    price,
    zalo,
    cover,
    images,
    createdAt: new Date().toISOString()
  };

  const data = JSON.parse(fs.readFileSync('data.json'));
  data.unshift(newProduct);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  res.send('Đăng sản phẩm thành công!');
});

// Route test
app.get('/', (req, res) => {
  res.send('✅ Backend đang chạy');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
