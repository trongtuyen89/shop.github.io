// Lấy danh sách sản phẩm từ localStorage (nếu có)
let products = JSON.parse(localStorage.getItem("products")) || [];

const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");

// Hàm hiển thị sản phẩm ra trang chủ
function renderProducts() {
  productList.innerHTML = "";

  products.forEach((product, index) => {
    const div = document.createElement("div");

    let gallery = "";
    for (let img of product.images) {
      if (img) {
        gallery += `<img src="${img}" alt="Ảnh sản phẩm">`;
      }
    }

    div.innerHTML = `
      <img src="${product.cover}" alt="Ảnh bìa sản phẩm">
      <h3>${product.name}</h3>
      <p><strong>Giá:</strong> ${Number(product.price).toLocaleString()} VND</p>
      <div>${gallery}</div>
      <button onclick="window.open('https://zalo.me/${product.zalo}', '_blank')">Mua</button>
    `;
    productList.appendChild(div);
  });
}

// Khi người dùng submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const cover = document.getElementById("cover").value.trim();
  const zalo = document.getElementById("zalo").value.trim();
  const images = [
    document.getElementById("img1").value.trim(),
    document.getElementById("img2").value.trim(),
    document.getElementById("img3").value.trim(),
    document.getElementById("img4").value.trim(),
    document.getElementById("img5").value.trim()
  ];

  if (!name || !price || !cover || !zalo) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
    return;
  }

  const newProduct = {
    name,
    price,
    cover,
    zalo,
    images
  };

  products.unshift(newProduct); // thêm sản phẩm mới lên đầu
  localStorage.setItem("products", JSON.stringify(products)); // lưu lại

  form.reset();
  renderProducts();
});

// Hiển thị ngay khi vào trang
renderProducts();
