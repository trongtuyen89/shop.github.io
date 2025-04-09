const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const upload = multer({ dest: "uploads/" });

const DATA_FILE = "data.json";

// Load sản phẩm
function loadProducts() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

// Lưu sản phẩm
function saveProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

// Route GET trang chủ
app.get("/", (req, res) => {
  res.send("✅ Backend đang chạy");
});

// Route POST /upload
const cpUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "extraImages", maxCount: 5 }
]);

app.post("/upload", cpUpload, (req, res) => {
  const { name, price, phone, password } = req.body;
  if (password !== "2802") {
    return res.status(401).json({ message: "Sai mật khẩu!" });
  }

  const coverImage = req.files["coverImage"]?.[0]?.filename;
  const extraImages = (req.files["extraImages"] || []).map(file => file.filename);

  const products = loadProducts();

  products.push({
    name,
    price,
    phone,
    coverImage,
    extraImages,
    createdAt: Date.now()
  });

  saveProducts(products);

  res.json({ message: "Đăng sản phẩm thành công!" });
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port", PORT);
});
