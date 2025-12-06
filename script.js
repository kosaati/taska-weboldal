document.addEventListener('DOMContentLoaded', () => {
  // ===== 1. NAVIGÁCIÓ AKTÍV LINK =====
  function setActiveNav() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentFile) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
  setActiveNav();

  // ===== 2. EGYSZERŰ KOSÁR LOCALSTORAGE-BEN =====
  const STORAGE_KEY = 'PK_CART';

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addToCart(product) {
    const cart = loadCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += product.qty;
    } else {
      cart.push(product);
    }
    saveCart(cart);
    alert('A termék bekerült a kosárba.');
  }

  function formatFt(num) {
    return num.toLocaleString('hu-HU') + ' Ft';
  }

  // ===== 3. KOSÁRBA GOMBOK KEZELÉSE (INDEX / TERMEKEK / PRODUCT-PAGE) =====
  document.querySelectorAll('.hozzaadas-gomb, .cta-button.kosarba, .product-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // termék kártya (termekek.html / ujdonsagok.html)
      const card = btn.closest('.termek-kartya');
      if (card) {
        const link = card.querySelector('a[href]');
        const titleEl = card.querySelector('h3');
        const priceEl = card.querySelector('.ar');

        if (!titleEl || !priceEl) return;

        const id = titleEl.textContent.trim();
        const title = titleEl.textContent.trim();
        const price = parseInt(priceEl.textContent.replace(/\D/g, ''), 10) || 0;
        const img = link ? link.querySelector('img') : null;

        addToCart({
          id,
          title,
          price,
          qty: 1,
          img: img ? img.src : '',
          color: '',
        });
        return;
      }

      // product-page.html – egyedi termék
      const productPage = document.querySelector('.vasarlasi-info');
      if (productPage) {
        const titleEl = productPage.querySelector('h1');
        const priceEl = productPage.querySelector('.ar');
        const mainImg = document.querySelector('.fokep');
        const qtyInput = document.getElementById('mennyiseg');

        if (!titleEl || !priceEl) return;

        const id = titleEl.textContent.trim();
        const title = titleEl.textContent.trim();
        const price = parseInt(priceEl.textContent.replace(/\D/g, ''), 10) || 0;
        const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value || '1', 10)) : 1;

        addToCart({
          id,
          title,
          price,
          qty,
          img: mainImg ? mainImg.src : '',
          color: '',
        });
      }
    });
  });

  // ===== 4. KOSÁR OLDAL MEGJELENÍTÉSE (kosar.html) =====
  const cartContainer = document.getElementById('cart-items');
  if (cartContainer) {
    function renderCart() {
      const cart = loadCart();
      cartContainer.innerHTML = '';

      if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Jelenleg üres a kosarad.</p>';
        updateTotals(0);
        return;
      }

      let subtotal = 0;

      cart.forEach((item, index) => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;

        const row = document.createElement('div');
        row.className = 'kosar-termek';
        row.innerHTML = `
          <img src="${item.img || 'https://via.placeholder.com/100x100/F0B9C9/FFFFFF?text=Táska'}"
               alt="${item.title}" class="kosar-kep">
          <div class="termek-info">
            <h3>${item.title}</h3>
          </div>
          <div class="mennyiseg-valaszto">
            <label>Mennyiség:</label>
            <input type="number" min="1" max="99" value="${item.qty}" data-index="${index}">
          </div>
          <p class="termek-ar">${formatFt(lineTotal)}</p>
          <button class="eltavolitas-btn" data-index="${index}" aria-label="Eltávolítás">
            <i class="fas fa-times"></i>
          </button>
        `;
        cartContainer.appendChild(row);
      });

      attachCartEvents();
      updateTotals(subtotal);
    }

    function attachCartEvents() {
      // mennyiség változtatás
      cartContainer.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', () => {
          let val = parseInt(input.value || '1', 10);
          if (isNaN(val) || val < 1) val = 1;
          input.value = val;

          const index = parseInt(input.dataset.index, 10);
          const cart = loadCart();
          if (cart[index]) {
            cart[index].qty = val;
            saveCart(cart);
            renderCart();
          }
        });
      });

      // eltávolítás
      cartContainer.querySelectorAll('.eltavolitas-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index, 10);
          const cart = loadCart();
          cart.splice(index, 1);
          saveCart(cart);
          renderCart();
        });
      });
    }

    function updateTotals(subtotal) {
      const shippingEl = document.getElementById('shipping');
      const subtotalEl = document.getElementById('subtotal');
      const totalEl = document.getElementById('total');

      const shipping = subtotal > 0 ? 2500 : 0;
      const total = subtotal + shipping;

      if (subtotalEl) subtotalEl.textContent = formatFt(subtotal);
      if (shippingEl) shippingEl.textContent = formatFt(shipping);
      if (totalEl) totalEl.textContent = formatFt(total);
    }

    renderCart();
  }
});
