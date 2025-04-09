const backendURL = "https://shoptuyentran-backend.onrender.com";

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const cover = document.getElementById('cover').files[0];
  const moreImages = [...document.getElementById('moreImages').files].slice(0, 5);

  const formData = new FormData();
  formData.append('images', cover);
  moreImages.forEach(img => formData.append('images', img));

  const uploadRes = await fetch(`${backendURL}/upload`, {
    method: 'POST',
    body: formData
  });
  const { urls } = await uploadRes.json();

  const product = {
    name,
    price,
    cover: urls[0],
    images: urls.slice(1),
    zalo: "https://zalo.me/0123456789" // 👈 Thay bằng link Zalo người bán
  };

  await fetch(`${backendURL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  alert("✅ Đăng sản phẩm thành công!");
  e.target.reset();
  loadProducts();
});

async function loadProducts() {
  const res = await fetch(`${backendURL}/products`);
  const data = await res.json();
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  data.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.cover}" />
      <h3>${p.name}</h3>
      <p><strong>Giá:</strong> ${Number(p.price).toLocaleString()}đ</p>
      <button onclick="window.open('${p.zalo}', '_blank')">💬 Mua</button>
    `;
    productList.appendChild(div);
  });
}

loadProducts();
