// ════════════════════════════════════════════════════════════
// FJBAIG — Main Application Logic
// ════════════════════════════════════════════════════════════

// ── Firebase Config ──
const firebaseConfig = {
  apiKey: "AIzaSyAnx1Z7f0OKUJbuaY6UKUjjx6MOC7qFFVg",
  authDomain: "fjbaig-shop.firebaseapp.com",
  projectId: "fjbaig-shop",
  storageBucket: "fjbaig-shop.firebasestorage.app",
  messagingSenderId: "654832424252",
  appId: "1:654832424252:web:024267ddc388141ec2fa39",
  measurementId: "G-1SRZ2TGSX2"
};

let db = null, auth = null, currentUser = null;
try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  auth.onAuthStateChanged(user => {
    currentUser = user;
    updateAuthUI();
  });
} catch (e) { console.log('Firebase not configured yet — running in local mode.'); }

function updateAuthUI() {
  const btn = document.getElementById('authNavBtn');
  if (currentUser) {
    btn.innerHTML = '<i class="fas fa-user"></i>';
    btn.setAttribute('onclick', "showView('account')");
  } else {
    btn.innerHTML = '<i class="far fa-user"></i>';
    btn.setAttribute('onclick', "showView('login')");
  }
}

// ── Auth Handlers ──
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  try {
    if (auth) { await auth.signInWithEmailAndPassword(email, pass); }
    else { currentUser = { email }; updateAuthUI(); }
    showToast('Welcome back!', 'success');
    showView('account');
  } catch (err) { showToast(err.message || 'Login failed', 'error'); }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;
  try {
    if (auth) {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      await cred.user.updateProfile({ displayName: name });
    } else { currentUser = { email, displayName: name }; updateAuthUI(); }
    showToast('Account created successfully!', 'success');
    showView('account');
  } catch (err) { showToast(err.message || 'Registration failed', 'error'); }
}

async function handleSignOut() {
  if (auth) {
    try { await auth.signOut(); } 
    catch (err) { console.log('Sign out error', err); }
  }
  currentUser = null;
  updateAuthUI();
  showToast('You have been signed out.', 'success');
  showView('home');
}

function handleContact(e) {
  e.preventDefault();
  showToast('Message sent! We will get back to you soon.', 'success');
  e.target.reset();
}

// ── Account Handlers ──
function renderAccount() {
  if (!currentUser) return showView('login');
  document.getElementById('accName').value = currentUser.displayName || '';
  document.getElementById('accEmail').value = currentUser.email || '';
}

async function handleUpdateProfile(e) {
  e.preventDefault();
  const newName = document.getElementById('accName').value;
  try {
    if (auth && auth.currentUser) await auth.currentUser.updateProfile({ displayName: newName });
    if (currentUser) currentUser.displayName = newName;
    showToast('Profile updated!', 'success');
  } catch (err) { showToast(err.message, 'error'); }
}

async function handleChangePassword(e) {
  e.preventDefault();
  const newPass = document.getElementById('accNewPass').value;
  try {
    if (auth && auth.currentUser) await auth.currentUser.updatePassword(newPass);
    document.getElementById('accNewPass').value = '';
    showToast('Password updated successfully!', 'success');
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') showToast('Please sign out and sign in again to change your password.', 'error');
    else showToast(err.message, 'error');
  }
}

// ── View Switching ──
function showView(name, addToHistory = true, data = null) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');
  window.scrollTo(0, 0);

  if (name === 'shop') { renderSidebar(); filterProducts(); }
  if (name === 'home') renderHome();
  if (name === 'wishlist') renderWishlist();
  if (name === 'checkout') renderCheckout();
  if (name === 'orders') renderOrders();
  if (name === 'account') renderAccount();

  if (addToHistory) {
    history.pushState({ view: name, data }, '', '#' + name + (data ? '/' + data : ''));
  }
}

// ── Browser Back/Forward ──
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.view) {
    if (e.state.view === 'product' && e.state.data) {
      if (typeof showProduct === 'function') showProduct(e.state.data, false);
    } else {
      showView(e.state.view, false);
    }
  } else {
    showView('home', false);
  }
});

function toggleMobileNav() { document.getElementById('mobileNav').classList.toggle('open'); }

// ── Wishlist View ──
function renderWishlist() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('wishlistEmpty');
  const items = wishlist.map(getProductById).filter(Boolean);
  if (!items.length) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = items.map(productCardHTML).join('');
}

// ── Checkout ──
function renderCheckout() {
  if (!cart.length) { showView('shop'); return; }
  const total = getCartTotal();
  const shipping = total >= 50 ? 0 : 5.99;
  const grand = total + shipping;

  document.getElementById('checkoutContent').innerHTML = `
    <div class="flex-1">
      <h2 class="font-serif text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">Billing details</h2>
      <form id="checkoutForm" onsubmit="placeOrder(event)">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">First name <span class="text-red-500">*</span></label>
            <input type="text" id="coFirstName" required class="checkout-input">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Last name <span class="text-red-500">*</span></label>
            <input type="text" id="coLastName" required class="checkout-input">
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Company name (optional)</label>
          <input type="text" id="coCompany" class="checkout-input">
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Country / Region <span class="text-red-500">*</span></label>
          <select id="coCountry" required class="checkout-input bg-white">
            <option value="">Select a country / region…</option>
            <option value="US">United States (US)</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom (UK)</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Street address <span class="text-red-500">*</span></label>
          <input type="text" id="coAddress" placeholder="House number and street name" required class="checkout-input mb-3">
          <input type="text" id="coApt" placeholder="Apartment, suite, unit, etc. (optional)" class="checkout-input">
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Town / City <span class="text-red-500">*</span></label>
            <input type="text" id="coCity" required class="checkout-input">
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Postcode / ZIP <span class="text-red-500">*</span></label>
            <input type="text" id="coZip" required class="checkout-input">
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Phone <span class="text-red-500">*</span></label>
          <input type="tel" id="coPhone" required class="checkout-input">
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Email address <span class="text-red-500">*</span></label>
          <input type="email" id="coEmail" required class="checkout-input">
        </div>

        <div class="mb-4 flex items-center gap-2">
          <input type="checkbox" id="coSubscribe" class="w-4 h-4 accent-slate-900">
          <label for="coSubscribe" class="text-sm text-slate-600">I would like to receive exclusive emails with discounts and product information</label>
        </div>

        <div class="mb-8 flex items-center gap-2">
          <input type="checkbox" id="coDiffAddress" class="w-4 h-4 accent-slate-900">
          <label for="coDiffAddress" class="text-base font-semibold text-slate-900">Ship to a different address?</label>
        </div>

        <div class="mb-8">
          <label class="block text-sm font-semibold text-slate-700 mb-1">Order notes (optional)</label>
          <textarea id="coNotes" rows="3" placeholder="Notes about your order, e.g. special notes for delivery." class="checkout-input" style="resize:vertical"></textarea>
        </div>
      </form>
    </div>

    <div class="w-full lg:w-[450px] shrink-0">
      <div class="border-2 border-slate-900 p-8 bg-white">
        <h3 class="font-serif text-2xl font-bold text-slate-900 mb-6">Your order</h3>
        
        <div class="flex justify-between border-b border-slate-200 pb-3 mb-4">
          <span class="font-bold text-slate-900">Product</span>
          <span class="font-bold text-slate-900">Subtotal</span>
        </div>

        <div class="space-y-4 mb-4 border-b border-slate-200 pb-4">
          ${cart.map(i => `
            <div class="flex justify-between text-sm">
              <span class="text-slate-600 pr-4">${i.name} - ${i.size} <strong class="text-slate-900 ml-1">× ${i.qty}</strong></span>
              <span class="font-medium text-slate-900">$${(i.price * i.qty).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="flex justify-between border-b border-slate-200 pb-4 mb-4 text-sm">
          <span class="font-bold text-slate-900">Subtotal</span>
          <span class="font-medium text-slate-900">$${total.toFixed(2)}</span>
        </div>

        <div class="border-b border-slate-200 pb-4 mb-4 text-sm">
          <div class="flex justify-between mb-2">
            <span class="font-bold text-slate-900">Shipment</span>
            <span class="font-medium text-slate-900">${shipping === 0 ? 'Free shipping' : '$' + shipping.toFixed(2)}</span>
          </div>
          ${shipping > 0 ? `<p class="text-slate-500 text-xs text-right mt-1">Enter your address to view shipping options.</p>` : ''}
        </div>

        <div class="flex justify-between text-lg mb-4">
          <span class="font-bold text-slate-900">Total</span>
          <span class="font-bold text-slate-900">$${grand.toFixed(2)}</span>
        </div>

        ${shipping > 0 ? `
        <div class="bg-slate-100 p-3 text-center text-sm font-semibold text-slate-800 mb-6 border border-slate-200">
          Add $${(50 - total).toFixed(2)} to cart and get free shipping!
        </div>
        ` : ''}

        <div class="bg-slate-50 p-5 mb-6 border border-slate-200">
          <h4 class="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2"><i class="fab fa-whatsapp text-green-500 text-lg"></i> Direct WhatsApp transfer</h4>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">
            Make your payment directly to us via WhatsApp. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
          </p>
        </div>

        <p class="text-xs text-slate-500 leading-relaxed mb-6">
          Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <a onclick="showView('privacy')" class="underline cursor-pointer text-slate-900">privacy policy</a>.
        </p>

        <button type="submit" form="checkoutForm" class="btn-primary w-full justify-center py-4 text-sm tracking-widest uppercase">Place order</button>
      </div>
    </div>`;
}

async function placeOrder(e) {
  e.preventDefault();
  const orderId = 'FJB-' + Date.now().toString(36).toUpperCase();
  const total = getCartTotal();
  const shipping = total >= 50 ? 0 : 5.99;
  const order = {
    orderId,
    userEmail: document.getElementById('coEmail').value,
    shippingDetails: {
      firstName: document.getElementById('coFirstName').value,
      lastName: document.getElementById('coLastName').value,
      company: document.getElementById('coCompany').value,
      address: document.getElementById('coAddress').value + ' ' + (document.getElementById('coApt').value || ''),
      city: document.getElementById('coCity').value,
      zip: document.getElementById('coZip').value,
      phone: document.getElementById('coPhone').value,
      country: document.getElementById('coCountry').value,
      notes: document.getElementById('coNotes').value
    },
    items: [...cart],
    totalAmount: total + shipping,
    paymentStatus: 'Pending Manual Verification',
    timestamp: new Date().toISOString()
  };

  // Save to Firestore if available
  try { if (db) await db.collection('orders').doc(orderId).set(order); } catch (err) { console.log('Firestore save skipped:', err); }

  // Save to local orders
  const localOrders = JSON.parse(localStorage.getItem('fjbaig_orders') || '[]');
  localOrders.unshift(order);
  localStorage.setItem('fjbaig_orders', JSON.stringify(localOrders));

  cart = [];
  saveCart();
  showView('order-success');

  document.getElementById('orderSuccessContent').innerHTML = `
    <div class="fade-in-up">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><i class="fas fa-check text-3xl text-green-600"></i></div>
      <h1 class="font-serif text-3xl font-bold text-slate-900 mb-2">Order Placed!</h1>
      <p class="text-slate-500 mb-4">Your order <strong class="text-slate-800">${orderId}</strong> has been submitted.</p>
      <div class="bg-green-50 border border-green-200 p-6 text-left mb-8">
        <h3 class="font-bold text-green-800 mb-2"><i class="fab fa-whatsapp mr-2"></i>Next Step: Complete Payment</h3>
        <p class="text-sm text-green-700 leading-relaxed">Contact us on WhatsApp at <a href="https://wa.me/17864706718?text=Hi%20FJBAIG,%20I%20placed%20order%20${orderId}%20and%20I%20would%20like%20to%20complete%20payment." target="_blank" class="underline font-bold">+1 (786) 470-6718</a> with your Order ID <strong>${orderId}</strong> to arrange payment of <strong>$${order.totalAmount.toFixed(2)}</strong>.</p>
      </div>
      <p class="text-sm text-slate-400 mb-6">Your order status will be updated to "Delivered" once payment is verified.</p>
      <button class="btn-primary" onclick="showView('home')">Continue Shopping</button>
    </div>`;
}

// ── Orders View ──
function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('fjbaig_orders') || '[]');
  const el = document.getElementById('ordersContent');
  if (!orders.length) {
    el.innerHTML = '<div class="text-center py-20"><i class="fas fa-box-open text-5xl text-slate-200 mb-4"></i><p class="text-slate-400 mb-4">No orders yet.</p><button class="btn-primary" onclick="showView(\'shop\')">Start Shopping</button></div>';
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="border border-slate-200 p-6 mb-4">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div><p class="font-bold text-slate-900">${o.orderId}</p><p class="text-xs text-slate-400">${new Date(o.timestamp).toLocaleDateString()}</p></div>
        <span class="text-xs font-bold px-3 py-1 ${o.paymentStatus.includes('Pending') ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}">${o.paymentStatus}</span>
      </div>
      <div class="space-y-2">${o.items.map(i => `<div class="flex items-center gap-3"><img src="${i.image}" class="w-12 h-14 object-cover"><p class="text-sm text-slate-600">${i.name} <span class="text-slate-400">× ${i.qty} (${i.size})</span></p></div>`).join('')}</div>
      <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between"><span class="text-slate-500 text-sm">Total</span><span class="font-bold text-slate-900">$${o.totalAmount.toFixed(2)}</span></div>
    </div>`).join('');
}

// ── Navbar scroll effect ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  loadLegalPages();
  updateCartUI();
  updateAuthUI();

  // Handle initial URL hash for direct links
  const hash = window.location.hash ? window.location.hash.substring(1).split('/') : ['home'];
  const initialView = hash[0] || 'home';
  const initialData = hash[1] || null;
  
  history.replaceState({ view: initialView, data: initialData }, '', window.location.hash || '#home');
  
  if (initialView === 'product' && initialData) {
    if (typeof showProduct === 'function') showProduct(initialData, false);
  } else {
    showView(initialView, false);
  }
});
