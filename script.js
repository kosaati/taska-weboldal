// PK Táskák - Teljes webshop logika
const PRODUCTS = [
  {id:1,title:"Rózsaszín válltáska",price:12900,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",color:"Rózsaszín",style:"Elegáns"},
  {id:2,title:"Levendula kézitáska",price:14900,img:"https://images.unsplash.com/photo-1581236001062-4e16f8e79923?w=400",color:"Levendula",style:"Mindennapi"},
  {id:3,title:"Fekete shopper táska",price:17900,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",color:"Fekete",style:"Vintage"},
  {id:4,title:"Bézs crossbody",price:11900,img:"https://images.unsplash.com/photo-1581236001062-4e16f8e79923?w=400",color:"Bézs",style:"Elegáns"},
  {id:5,title:"Rózsaszín clutch",price:9900,img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",color:"Rózsaszín",style:"Mindennapi"},
  {id:6,title:"Szürke tote bag",price:15900,img:"https://images.unsplash.com/photo-1581236001062-4e16f8e79923?w=400",color:"Szürke",style:"Vintage"}
];

let cart = JSON.parse(localStorage.getItem('pk_cart')) || [];

// Cart count frissítése (headerben)
function updateCartCount(){
  const countEl = document.getElementById('cart-count');
  if(countEl) countEl.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
}

// Főoldali termék render
function renderHomeProducts(){
  const grid = document.getElementById('product-grid') || document.querySelector('.product-grid');
  if(!grid) return;
  grid.innerHTML = '';
  PRODUCTS.slice(0,4).forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="price">${p.price.toLocaleString()} Ft</div>
      <button data-id="${p.id}">Kosárba</button>
    `;
    grid.appendChild(card);
  });
}

// Szűrős termék grid
function renderProductGrid(){
  const grid = document.getElementById('product-grid') || document.querySelector('.product-grid');
  if(!grid) return;
  
  const fcolor = document.getElementById('filter-color')?.value || 'all';
  const fstyle = document.getElementById('filter-style')?.value || 'all';
  const fprice = document.getElementById('filter-price')?.value || 'all';
  const search = document.getElementById('search-input')?.value.toLowerCase() || '';
  
  const filtered = PRODUCTS.filter(p => 
    (fcolor === 'all' || p.color === fcolor) &&
    (fstyle === 'all' || p.style === fstyle) &&
    (fprice === 'all' || 
     (fprice === 'low' && p.price < 10000) ||
     (fprice === 'mid' && p.price >= 10000 && p.price <= 15000) ||
     (fprice === 'high' && p.price > 15000)) &&
    (search === '' || p.title.toLowerCase().includes(search))
  );
  
  grid.innerHTML = '';
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="price">${p.price.toLocaleString()} Ft</div>
      <button data-id="${p.id}">Kosárba</button>
    `;
    grid.appendChild(card);
  });
}

// Kosár mentés
function saveCart(){ localStorage.setItem('pk_cart', JSON.stringify(cart)); }

// Kosár render
function renderCart(){
  const container = document.getElementById('cart-container');
  const summary = document.getElementById('cart-summary');
  if(!container || !summary) return;
  
  container.innerHTML = '';
  if(cart.length === 0){
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--muted);">Kosarad üres. <a href="index.html">Vásárolj most!</a></p>';
    summary.innerHTML = '';
    return;
  }
  
  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div style="
