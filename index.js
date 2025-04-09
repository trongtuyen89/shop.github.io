const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Tạo folder uploads nếu chưa có
const uploadFolder = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadFolder);

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// API upload ảnh
app.post('/upload', upload.array('images', 6), (req, res) => {
  const urls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
  res.json({ urls });
});

// API lấy danh sách sản phẩm
app.get('/products', async (req, res) => {
  const data = await fs.readJson('./data.json').catch(() => []);
  res.json(data);
});

// API đăng sản phẩm
app.post('/products', async (req, res) => {
  const newProduct = req.body;
  const products = await fs.readJson('./data.json').catch(() => []);
  products.unshift(newProduct);
  await fs.writeJson('./data.json', products);
  res.json({ success: true });
});

// Cung cấp ảnh tĩnh
app.use('/uploads', express.static(uploadFolder));

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
app.get('/products', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
  res.json(data);
});
