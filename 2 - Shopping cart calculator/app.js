
const GST_RATE = 0.18;         // 18% GST
const DISCOUNT_RATE = 0.10;    // 10% optional discount
const FLAT_DELIVERY_CHARGE = 50;
const FREE_DELIVERY_ABOVE = 999;

// A colour is assigned to each category so fallback images look distinct.
const CATEGORY_COLORS = {
  "Electronics": ["#0F7173", "#0A5658"],
  "Clothing": ["#F4A300", "#D98E00"],
  "Grocery": ["#3F8F4F", "#2E6B3A"],
  "Books": ["#7B5EA7", "#5B3F87"],
  "Home & Kitchen": ["#E0574C", "#B5382F"]
};

function makePlaceholderImage(name, category) {
  const [c1, c2] = CATEGORY_COLORS[category] || CATEGORY_COLORS["Electronics"];
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <text x="50%" y="52%" font-family="Segoe UI, sans-serif" font-size="120"
            fill="white" fill-opacity="0.9" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
        ${initials}
      </text>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const DEFAULT_PRODUCTS = [
  { name: "Wireless Earbuds",   price: 1999, category: "Electronics",     photo: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80&auto=format&fit=crop" },
  { name: "Smartwatch",         price: 3499, category: "Electronics",     photo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80&auto=format&fit=crop" },
  { name: "Bluetooth Speaker",  price: 1499, category: "Electronics",     photo: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80&auto=format&fit=crop" },
  { name: "Men's T-Shirt",      price: 499,  category: "Clothing",        photo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80&auto=format&fit=crop" },
  { name: "Women's Kurti",      price: 799,  category: "Clothing",        photo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80&auto=format&fit=crop" },
  { name: "Denim Jacket",       price: 1899, category: "Clothing",        photo: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80&auto=format&fit=crop" },
  { name: "Basmati Rice 5kg",   price: 650,  category: "Grocery",         photo: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80&auto=format&fit=crop" },
  { name: "Organic Honey 500g", price: 350,  category: "Grocery",         photo: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80&auto=format&fit=crop" },
  { name: "Green Tea Pack",     price: 220,  category: "Grocery",         photo: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&q=80&auto=format&fit=crop" },
  { name: "Fiction Novel",      price: 350,  category: "Books",           photo: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80&auto=format&fit=crop" },
  { name: "Cookbook",           price: 499,  category: "Books",           photo: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=500&q=80&auto=format&fit=crop" },
  { name: "Notebook Set",       price: 150,  category: "Books",           photo: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80&auto=format&fit=crop" },
  { name: "Non-stick Pan",      price: 899,  category: "Home & Kitchen",  photo: "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=500&q=80&auto=format&fit=crop" },
  { name: "LED Desk Lamp",      price: 699,  category: "Home & Kitchen",  photo: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80&auto=format&fit=crop" },
  { name: "Coffee Mug Set",     price: 399,  category: "Home & Kitchen",  photo: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80&auto=format&fit=crop" }
].map((p, i) => ({
  id: i + 1,
  image: p.photo,
  fallback: makePlaceholderImage(p.name, p.category),
  rating: (3.8 + ((i * 7) % 12) / 10).toFixed(1), 
  ...p
}));

function productImgTag(p, cssClass = "") {
  const fallback = p.fallback || makePlaceholderImage(p.name, p.category);
  return `<img class="${cssClass}" src="${p.image}" alt="${p.name}"
            onerror="this.onerror=null;this.src='${fallback}';">`;
}

// Renders a 5-star rating row from a numeric rating like 4.3
function starRow(rating) {
  const full = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<i class="fa-solid fa-star" style="${i > full ? 'opacity:.25' : ''}"></i>`;
  }
  return `<div class="product-rating">${stars} <span>${rating}</span></div>`;
}


function getProducts() {
  const data = localStorage.getItem("qc_products");
  return data ? JSON.parse(data) : [];
}
function saveProducts(products) {
  localStorage.setItem("qc_products", JSON.stringify(products));
}

function getCart() {
  const data = localStorage.getItem("qc_cart");
  return data ? JSON.parse(data) : [];
}
function saveCart(cart) {
  localStorage.setItem("qc_cart", JSON.stringify(cart));
}

function getOrders() {
  const data = localStorage.getItem("qc_orders");
  return data ? JSON.parse(data) : [];
}
function saveOrders(orders) {
  localStorage.setItem("qc_orders", JSON.stringify(orders));
}

const TOAST_ICONS = {
  success: "fa-circle-check",
  error: "fa-circle-exclamation",
  info: "fa-circle-info"
};

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${TOAST_ICONS[type] || TOAST_ICONS.info}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Close the mobile nav menu after a link is tapped
  document.getElementById("navLinks").classList.remove("open");

  // Refresh page-specific content each time it's opened
  if (pageId === "products-page") renderProducts();
  if (pageId === "cart-page") renderCart();
  if (pageId === "checkout-page") renderCheckoutSummary();
  if (pageId === "admin-page") renderAdminTable();
}

function toggleMobileNav() {
  document.getElementById("navLinks").classList.toggle("open");
}

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(getProducts().map(p => p.category))];
  select.innerHTML = '<option value="all">All Categories</option>' +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

function renderHomeCategoryChips() {
  const wrap = document.getElementById("homeCategoryChips");
  const categories = [...new Set(getProducts().map(p => p.category))];
  wrap.innerHTML = categories.map(c =>
    `<button class="category-chip" onclick="goToCategory('${c}')">${c}</button>`
  ).join("");
}

function goToCategory(category) {
  showPage("products-page");
  document.getElementById("categoryFilter").value = category;
  renderProducts();
}

function renderProducts() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  let products = getProducts();
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search));
  if (category !== "all") products = products.filter(p => p.category === category);

  const grid = document.getElementById("productGrid");
  const noMsg = document.getElementById("noProductsMsg");

  if (products.length === 0) {
    grid.innerHTML = "";
    noMsg.classList.remove("hidden");
    return;
  }
  noMsg.classList.add("hidden");

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card" style="animation-delay:${Math.min(i * 0.04, 0.4)}s">
      <div class="product-img-wrap">${productImgTag(p)}</div>
      <div class="product-card-body">
        <span class="product-category">${p.category}</span>
        <span class="product-name">${p.name}</span>
        ${p.rating ? starRow(p.rating) : ""}
        <span class="product-price">₹${p.price}</span>
        <button class="btn btn-primary" onclick="addToCart(${p.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join("");
}



function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();

  const product = getProducts().find(p => p.id === productId);
  showToast(`${product ? product.name : "Item"} added to cart`, "success");
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    
    saveCart(cart.filter(i => i.id !== productId));
    showToast("Item removed from cart", "info");
  } else {
    saveCart(cart);
  }
  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  saveCart(getCart().filter(i => i.id !== productId));
  updateCartCount();
  renderCart();
  showToast("Item removed from cart", "info");
}

function updateCartCount() {
  const totalItems = getCart().reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById("cartCount");
  badge.textContent = totalItems;
  badge.classList.remove("bump");
  void badge.offsetWidth; 
  badge.classList.add("bump");
}

function getCartDetails() {
  const products = getProducts();
  return getCart().map(item => {
    const product = products.find(p => p.id === item.id);
    return product ? { ...product, qty: item.qty } : null;
  }).filter(Boolean);
}

function calculateBilling(cartDetails, applyDiscount) {
  const subtotal = cartDetails.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = applyDiscount ? subtotal * DISCOUNT_RATE : 0;
  const gst = (subtotal - discount) * GST_RATE;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : FLAT_DELIVERY_CHARGE;
  const total = subtotal - discount + gst + delivery;
  return { subtotal, discount, gst, delivery, total };
}

function renderCart() {
  const cartDetails = getCartDetails();
  const layout = document.getElementById("cartLayout");
  const emptyMsg = document.getElementById("cartEmptyMsg");

  if (cartDetails.length === 0) {
    layout.classList.add("hidden");
    emptyMsg.classList.remove("hidden");
    return;
  }
  emptyMsg.classList.add("hidden");
  layout.classList.remove("hidden");

  document.getElementById("cartTableBody").innerHTML = cartDetails.map(item => `
    <tr>
      <td>
        <div class="cart-product-cell">
          ${productImgTag(item)}
          <span>${item.name}</span>
        </div>
      </td>
      <td>₹${item.price}</td>
      <td>
        <div class="qty-control">
          <button onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td>₹${item.price * item.qty}</td>
      <td><button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove item"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join("");

  const applyDiscount = document.getElementById("discountToggle").checked;
  const bill = calculateBilling(cartDetails, applyDiscount);

  document.getElementById("billSubtotal").textContent = `₹${bill.subtotal.toFixed(2)}`;
  document.getElementById("billDiscount").textContent = `-₹${bill.discount.toFixed(2)}`;
  document.getElementById("billGst").textContent = `₹${bill.gst.toFixed(2)}`;
  document.getElementById("billDelivery").textContent = bill.delivery === 0 ? "FREE" : `₹${bill.delivery.toFixed(2)}`;
  document.getElementById("billTotal").textContent = `₹${bill.total.toFixed(2)}`;
}

function renderCheckoutSummary() {
  const cartDetails = getCartDetails();
  const applyDiscount = document.getElementById("discountToggle").checked;
  const bill = calculateBilling(cartDetails, applyDiscount);
  const itemCount = cartDetails.reduce((sum, i) => sum + i.qty, 0);

  document.getElementById("checkoutSummary").innerHTML = `
    <div><span>Items in cart</span><span>${itemCount}</span></div>
    <div><span>Subtotal</span><span>₹${bill.subtotal.toFixed(2)}</span></div>
    <div><span>Discount</span><span>-₹${bill.discount.toFixed(2)}</span></div>
    <div><span>GST (18%)</span><span>₹${bill.gst.toFixed(2)}</span></div>
    <div><span>Delivery</span><span>${bill.delivery === 0 ? "FREE" : "₹" + bill.delivery.toFixed(2)}</span></div>
    <div><strong>Total</strong><strong>₹${bill.total.toFixed(2)}</strong></div>
  `;
}

function placeOrder(event) {
  event.preventDefault();

  const cartDetails = getCartDetails();
  if (cartDetails.length === 0) {
    showToast("Your cart is empty. Add products before checking out.", "error");
    return;
  }

  const applyDiscount = document.getElementById("discountToggle").checked;
  const bill = calculateBilling(cartDetails, applyDiscount);
  const payment = document.querySelector('input[name="payment"]:checked').value;

  const order = {
    orderId: "QC" + Date.now(),
    date: new Date().toLocaleString("en-IN"),
    customer: {
      name: document.getElementById("custName").value.trim(),
      mobile: document.getElementById("custMobile").value.trim(),
      address: document.getElementById("custAddress").value.trim(),
      payment
    },
    items: cartDetails,
    billing: bill
  };

  
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  localStorage.setItem("qc_currentOrder", JSON.stringify(order));

  
  saveCart([]);
  updateCartCount();

  document.getElementById("checkoutForm").reset();
  renderInvoice(order);
  showPage("invoice-page");
  showToast("Order placed successfully!", "success");
}

function renderInvoice(order) {
  const sheet = document.getElementById("invoiceSheet");
  if (!order) {
    sheet.innerHTML = `<p>No invoice to show yet. Place an order first.</p>`;
    return;
  }

  const rows = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>₹${item.price}</td>
      <td>₹${item.price * item.qty}</td>
    </tr>
  `).join("");

  sheet.innerHTML = `
    <h2><i class="fa-solid fa-file-invoice"></i> QuickCart — Invoice</h2>
    <div class="invoice-meta">
      <div>
        <strong>Bill to:</strong> ${order.customer.name}<br>
        ${order.customer.mobile}<br>
        ${order.customer.address}
      </div>
      <div style="text-align:right">
        <strong>Order ID:</strong> ${order.orderId}<br>
        <strong>Date:</strong> ${order.date}<br>
        <strong>Payment:</strong> ${order.customer.payment}
      </div>
    </div>

    <table class="invoice-table">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="invoice-totals">
      <div><span>Subtotal</span><span>₹${order.billing.subtotal.toFixed(2)}</span></div>
      <div><span>Discount</span><span>-₹${order.billing.discount.toFixed(2)}</span></div>
      <div><span>GST (18%)</span><span>₹${order.billing.gst.toFixed(2)}</span></div>
      <div><span>Delivery</span><span>${order.billing.delivery === 0 ? "FREE" : "₹" + order.billing.delivery.toFixed(2)}</span></div>
      <div class="invoice-grand"><span>Total Paid</span><span>₹${order.billing.total.toFixed(2)}</span></div>
    </div>
  `;
}


function renderAdminTable() {
  const products = getProducts();
  document.getElementById("adminTableBody").innerHTML = products.map(p => `
    <tr>
      <td>${productImgTag(p)}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>₹${p.price}</td>
      <td class="table-actions">
        <button class="btn btn-outline" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn btn-danger" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join("");
}

function saveProductForm(event) {
  event.preventDefault();

  const id = document.getElementById("adminProductId").value;
  const name = document.getElementById("adminName").value.trim();
  const price = Number(document.getElementById("adminPrice").value);
  const category = document.getElementById("adminCategory").value.trim();
  const imageUrl = document.getElementById("adminImage").value.trim();
  const products = getProducts();

  if (id) {
    
    const product = products.find(p => p.id === Number(id));
    product.name = name;
    product.price = price;
    product.category = category;
    product.image = imageUrl || product.image;
    product.fallback = makePlaceholderImage(name, category);
    showToast("Product updated", "success");
  } else {
    
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const fallback = makePlaceholderImage(name, category);
    products.push({ id: newId, name, price, category, image: imageUrl || fallback, fallback, rating: "4.5" });
    showToast("Product added", "success");
  }

  saveProducts(products);
  resetAdminForm();
  renderAdminTable();
  populateCategoryFilter();
  renderHomeCategoryChips();
}

function editProduct(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product) return;
  document.getElementById("adminProductId").value = product.id;
  document.getElementById("adminName").value = product.name;
  document.getElementById("adminPrice").value = product.price;
  document.getElementById("adminCategory").value = product.category;
  document.getElementById("adminImage").value = product.image.startsWith("data:") ? "" : product.image;
  document.getElementById("adminFormTitle").innerHTML = '<i class="fa-solid fa-pen"></i> Edit Product';
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  saveProducts(getProducts().filter(p => p.id !== id));
  renderAdminTable();
  populateCategoryFilter();
  renderHomeCategoryChips();
  showToast("Product deleted", "info");
}

function resetAdminForm() {





  document.getElementById("adminForm").reset();
  document.getElementById("adminProductId").value = "";
  document.getElementById("adminFormTitle").innerHTML = '<i class="fa-solid fa-plus"></i> Add New Product';
}



function init() {
  
  if (getProducts().length === 0) {
    saveProducts(DEFAULT_PRODUCTS);
  }

  populateCategoryFilter();
  renderHomeCategoryChips();
  renderProducts();
  updateCartCount();
  renderAdminTable();

 
  const currentOrder = localStorage.getItem("qc_currentOrder");
  if (currentOrder) renderInvoice(JSON.parse(currentOrder));

  
  setTimeout(() => document.getElementById("preloader").classList.add("fade-out"), 500);
}

document.addEventListener("DOMContentLoaded", init);

 