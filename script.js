// Simple client-side shop logic: products, filters, cart, order
<button data-id="${p.id}">Kosárba</button>
`;
grid.appendChild(card);
});}


// Add to cart
function addToCart(id, qty=1){
const prod = PRODUCTS.find(p=>p.id===Number(id)); if(!prod) return;
const existing = cart.find(i=>i.id===prod.id);
if(existing){ existing.qty += qty; } else { cart.push({id:prod.id,title:prod.title,price:prod.price,qty:qty,img:prod.img}); }
saveCart(); renderCart();}


// Render cart page
function renderCart(){const container=document.getElementById('cart-container'); const summary=document.getElementById('cart-summary'); if(!container||!summary) return;
container.innerHTML=''; if(cart.length===0){container.innerHTML='<p>Kosarad üres.</p>'; summary.innerHTML=''; return;}
cart.forEach(item=>{
const el=document.createElement('div'); el.className='cart-item';
el.innerHTML = `<img src="${item.img}" alt="${item.title}"><div style="flex:1"><strong>${item.title}</strong><div>${item.qty} x ${item.price.toLocaleString()} Ft</div></div><div style="text-align:right"><button data-remove="${item.id}">Törlés</button></div>`;
container.appendChild(el);
});
const total = cart.reduce((s,i)=>s + i.qty*i.price,0);
summary.innerHTML = `<div class="cart-summary"><strong>Összesen: ${total.toLocaleString()} Ft</strong></div>`;
}


// Remove from cart
function removeFromCart(id){cart = cart.filter(i=>i.id!==Number(id)); saveCart(); renderCart();}


// Order form handling
function populateOrderSummary(){const el=document.getElementById('order-summary'); if(!el) return; if(cart.length===0) {el.innerHTML='<p>Kosár üres</p>'; return;} const total = cart.reduce((s,i)=>s + i.qty*i.price,0); el.innerHTML = `<strong>Rendelés összegzés</strong><div>${cart.map(i=>`${i.qty}× ${i.title}`).join('<br>')}</div><div style="margin-top:8px">Összesen: <strong>${total.toLocaleString()} Ft</strong></div>`; }


function submitOrder(e){
e.preventDefault();
const name=document.getElementById('name').value; const email=document.getElementById('email').value; const address=document.getElementById('address').value; const phone=document.getElementById('phone').value;
if(!name||!email||!address||!phone){alert('Kérlek töltsd ki az összes kötelező mezőt.');return;}
// In real project: send to server. Here we simulate success.
const order = {id:Date.now(),name,email,address,phone,cart, total:cart.reduce((s,i)=>s+i.qty*i.price,0)};
console.log('Order placed:',order);
localStorage.removeItem('pk_cart'); cart=[]; saveCart(); alert('Köszönjük a rendelést! Ezt a demó rendszer csak szimulálja.'); window.location.href='index.html';
}


// Init and event listeners
function init(){
updateCartCount(); renderHomeProducts(); renderProductGrid(); renderCart(); populateOrderSummary();
// Global button events (add to cart)
document.body.addEventListener('click',e=>{
if(e.target.matches('button[data-id]')){ addToCart(e.target.dataset.id,1); }
if(e.target.matches('button[data-remove]')){ removeFromCart(e.target.dataset.remove); }
});
// Filters
const fcolor=document.getElementById('filter-color'); const fstyle=document.getElementById('filter-style'); const fprice=document.getElementById('filter-price'); const search=document.getElementById('search-input');
[fcolor,fstyle,fprice,search].forEach(el=>{ if(el) el.addEventListener('input',renderProductGrid); });
// Order form
const orderForm=document.getElementById('order-form'); if(orderForm) { populateOrderSummary(); orderForm.addEventListener('submit',submitOrder); }
// Contact form demo
const contactForm=document.getElementById('contact-form'); if(contactForm){ contactForm.addEventListener('submit',e=>{ e.preventDefault(); alert('Köszönjük az üzenetet! Hamarosan válaszolunk.'); contactForm.reset(); }); }
}


window.addEventListener('DOMContentLoaded',init);
