const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Lưu ảnh với Multer
const upload = multer({ dest: 'uploads/' });

// Đọc danh sách sản phẩm
app.get('/products', (req, res) => {
  const data = fs.readFileSync('data.json');
  res.json(JSON.parse(data));
});

// Đăng sản phẩm mới
app.post('/add-product', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  const { name, price } = req.body;
  const cover = req.files['cover'][0].filename;
  const images = req.files['images']?.map(img => img.filename) || [];

  const newProduct = {
    id: Date.now(),
    name,
    price,
    cover,
    images
  };

  const data = JSON.parse(fs.readFileSync('data.json'));
  data.push(newProduct);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  res.json({ message: 'OK', product: newProduct });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
