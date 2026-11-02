let allMenuItems = [];
let cart = [];

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/menu');
  allMenuItems = await res.json();
  renderMenu(allMenuItems);
});

function renderMenu(items) {
  const container = document.getElementById('menuContainer');
  container.innerHTML = items.map(item => `
    <div class="item-card">
      <div style="font-size: 2.5rem;">${item.image}</div>
      <div><strong>${item.name}</strong></div>
      <div style="color: #f59e0b; margin: 8px 0;">${item.price.toFixed(2)} €</div>
      <button onclick="addToCart(${item.id})">Ajouter</button>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = allMenuItems.find(i => i.id === id);
  const found = cart.find(i => i.id === id);
  if (found) found.quantity++;
  else cart.push({ ...item, quantity: 1 });
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  const btn = document.getElementById('btnSubmit');

  if (cart.length === 0) {
    container.innerHTML = 'Panier vide';
    countEl.innerText = '0';
    totalEl.innerText = '0.00 €';
    btn.disabled = true;
    return;
  }

  let total = 0, count = 0;
  container.innerHTML = cart.map(i => {
    total += i.price * i.quantity;
    count += i.quantity;
    return `<div>${i.name} x${i.quantity} (${(i.price * i.quantity).toFixed(2)}€)</div>`;
  }).join('');

  countEl.innerText = count;
  totalEl.innerText = total.toFixed(2) + ' €';
  btn.disabled = false;
}

async function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value;
  const phone = document.getElementById('customerPhone').value;
  const total = parseFloat(document.getElementById('cartTotal').innerText);

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer: { name, phone }, cart, total })
  });

  if (res.ok) {
    const data = await res.json();
    const notif = document.getElementById('orderNotification');
    notif.innerText = `Commande validée ! (${data.orderId})`;
    notif.style.display = 'block';
    cart = [];
    updateCartUI();
    document.getElementById('orderForm').reset();
  }
}