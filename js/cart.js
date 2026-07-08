// ── Cart & Wishlist State ──
let cart = JSON.parse(localStorage.getItem('fjbaig_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('fjbaig_wishlist') || '[]');

function saveCart() { localStorage.setItem('fjbaig_cart', JSON.stringify(cart)); updateCartUI(); }
function saveWishlist() { localStorage.setItem('fjbaig_wishlist', JSON.stringify(wishlist)); }

function addToCart(productId, size, qty = 1) {
  if (!size) { showToast('Please select a size first', 'error'); return; }
  const p = getProductById(productId);
  const existing = cart.find(i => i.id === productId && i.size === size);
  if (existing) { existing.qty += qty; } else { cart.push({ id: productId, name: p.name, price: p.price, image: p.images[0], size, qty }); }
  saveCart();
  showToast(`${p.name} added to bag!`, 'success');
}

function removeFromCart(index) { cart.splice(index, 1); saveCart(); renderCartDrawer(); }

function updateCartQty(index, delta) {
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  saveCart(); renderCartDrawer();
}

function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }

function updateCartUI() {
  document.getElementById('cartBadge').textContent = getCartCount();
  document.getElementById('cartCount').textContent = getCartCount();
  document.getElementById('cartSubtotal').textContent = '$' + getCartTotal().toFixed(2);
}

function renderCartDrawer() {
  const el = document.getElementById('cartItems');
  if (!cart.length) { el.innerHTML = '<div class="text-center py-16"><i class="fas fa-shopping-bag text-4xl text-slate-200 mb-4"></i><p class="text-slate-400 text-sm">Your bag is empty</p></div>'; updateCartUI(); return; }
  el.innerHTML = cart.map((item, i) => `
    <div class="cart-item fade-in">
      <img src="${item.image}" alt="${item.name}">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-slate-800">${item.name}</h4>
        <p class="text-xs text-slate-400 mt-1">Size: ${item.size}</p>
        <div class="flex items-center gap-2 mt-2">
          <button onclick="updateCartQty(${i},-1)" class="qty-btn" style="width:28px;height:28px;font-size:14px">−</button>
          <span class="text-sm font-semibold w-6 text-center">${item.qty}</span>
          <button onclick="updateCartQty(${i},1)" class="qty-btn" style="width:28px;height:28px;font-size:14px">+</button>
        </div>
        <p class="text-sm font-bold text-slate-900 mt-2">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <button onclick="removeFromCart(${i})" class="text-slate-300 hover:text-red-500 text-lg">&times;</button>
    </div>`).join('');
  updateCartUI();
}

function openCart() { document.getElementById('cartOverlay').classList.add('open'); document.getElementById('cartDrawer').classList.add('open'); renderCartDrawer(); }
function closeCart() { document.getElementById('cartOverlay').classList.remove('open'); document.getElementById('cartDrawer').classList.remove('open'); }

function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist', 'success'); }
  else { wishlist.push(productId); showToast('Added to wishlist!', 'success'); }
  saveWishlist();
}

function isInWishlist(id) { return wishlist.includes(id); }

function showToast(msg, type = 'success') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

function goToCheckout() {
  if (!cart.length) { showToast('Your cart is empty', 'error'); return; }
  closeCart(); showView('checkout');
}
