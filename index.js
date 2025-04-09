const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Cấu hình lưu file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Tạo file data.json nếu chưa có
const dataPath = 'data.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]');
}

// Route đăng sản phẩm
app.post('/upload', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  const { name, price, zalo, password } = req.body;

  // Kiểm tra mật khẩu
  if (password !== '2802') {
    return res.status(403).send('Sai mật khẩu');
  }

  const cover = req.files['cover']?.[0]?.path || '';
  const images = (req.files['images'] || []).map(file => file.path);

  const newProduct = {
    name,
    price,
    zalo,
    cover,
    images,
    createdAt: new Date().toISOString()
  };

  // Lưu vào data.json
  const products = JSON.parse(fs.readFileSync(dataPath));
  products.unshift(newProduct);
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

  res.send('Đăng sản phẩm thành công!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
