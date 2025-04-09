const backendURL = 'https://shoptuyentran-backend.onrender.com';

fetch(`${backendURL}/products`)
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById('product-list');
    list.innerHTML = ''; // clear loading text

    products.reverse().forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';

      div.innerHTML = `
        <img src="${backendURL}/${product.cover}" alt="Ảnh bìa">
        <h3>${product.name}</h3>
        <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
        <a href="https://zalo.me/${product.zalo}" target="_blank">💬 Mua qua Zalo</a>
      `;

      list.appendChild(div);
    });
  })
  .catch(error => {
    document.getElementById('product-list').innerHTML = '❌ Lỗi khi tải sản phẩm!';
    console.error(error);
  });
