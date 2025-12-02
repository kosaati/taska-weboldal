// Egyszerű kosár számláló localStorage-ben
const CART_KEY = 'tasak_shop_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.q || 1), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = total;
}

updateCartCount();
