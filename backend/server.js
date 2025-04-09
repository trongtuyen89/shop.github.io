const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync('data.json'));
  } catch {
    return [];
  }
}

function saveProduct(product) {
  const data = readProducts();
  data.unshift(product);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

app.get('/products', (req, res) => {
  res.json(readProducts());
});

app.post('/upload', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  const { name, price } = req.body;
  const cover = req.files['cover'][0].path;
  const images = (req.files['images'] || []).map(file => file.path);

  const product = { name, price: parseInt(price), cover, images };
  saveProduct(product);
  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
