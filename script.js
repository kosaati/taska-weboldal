// --- TERMÉKEK (alaplista) ---
const PRODUCTS = [
  { id: 't1', title: 'Pasztell válltáska', price: 25900 },
  { id: 't2', title: 'Elegáns kézitáska', price: 31900 },
  { id: 't3', title: 'Weekend shopper',   price: 28900 },
];

// formázás Ft-ben
function formatFt(num) {
  return num.toLocaleString('hu-HU') + ' Ft';
}

// --- KOSÁR LOCALSTORAGE-BAN ---
const CART_KEY = 'tasak_shop_cart_v1';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;

  const cart = getCart();
  const found = cart.find(i => i.id === productId);

  if (found) {
    found.q += 1;
  } else {
    cart.push({ id: p.id, title: p.title, price: p.price, q: 1 });
  }

  saveCart(cart);
  alert(p.title + ' hozzáadva a kosárhoz.');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.q, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

// --- FŐOLDALI TERMÉKKÁRTYÁK (index.html) ---
function renderIndexProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${formatFt(p.price)}</p>
      <button class="btn" data-add="${p.id}">Kosárba</button>
    `;
    container.appendChild(card);
  });
}

// --- KOSÁR OLDAL KIRAJZOLÁSA (kosar.html) ---
function renderCartPage() {
  const table = document.getElementById('cart-table-body');
  const summary = document.getElementById('cart-summary');
  if (!table || !summary) return;

  const cart = getCart();
  table.innerHTML = '';

  if (cart.length === 0) {
    summary.textContent = 'A kosarad jelenleg üres.';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const row = document.createElement('tr');
    const lineTotal = item.price * item.q;
    total += lineTotal;

    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.q}</td>
      <td>${formatFt(item.price)}</td>
      <td>${formatFt(lineTotal)}</td>
      <td><button class="btn" data-remove="${item.id}">Törlés</button></td>
    `;
    table.appendChild(row);
  });

  summary.textContent = 'Összesen: ' + formatFt(total);
}

// --- ESEMÉNYKEZELŐK ---
document.addEventListener('click', e => {
  const addBtn = e.target.closest('[data-add]');
  if (addBtn) {
    addToCart(addBtn.getAttribute('data-add'));
    return;
  }

  const removeBtn = e.target.closest('[data-remove]');
  if (removeBtn) {
    removeFromCart(removeBtn.getAttribute('data-remove'));
    renderCartPage();
    return;
  }
});

// --- INITIALIZÁLÁS ---
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderIndexProducts();
  renderCartPage();
});
