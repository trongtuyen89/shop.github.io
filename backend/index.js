app.post('/upload', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]), (req, res) => {
  const { name, price, zalo, password } = req.body;

  const correctPassword = '2802'; // ✅ sửa đúng mật khẩu tại đây
  if (password !== correctPassword) {
    return res.status(403).send('❌ Mật khẩu sai! Không được phép đăng.');
  }

  console.log(req.files); // kiểm tra ảnh có nhận được không
  console.log(req.body);  // kiểm tra dữ liệu có đúng không

  try {
    const cover = req.files['cover']?.[0]?.path || '';
    const images = (req.files['images'] || []).map(file => file.path);

    const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
    data.push({ name, price: parseInt(price), zalo, cover, images });
    fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

    res.send('✅ Đăng sản phẩm thành công!');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Có lỗi xảy ra trên server');
  }
});
