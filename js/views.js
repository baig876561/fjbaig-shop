// ── Render Helpers ──
function starsHTML(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += `<i class="fa${i <= Math.round(rating) ? 's' : 'r'} fa-star"></i>`;
  return `<span class="stars">${s}</span>`;
}

function avgRating(reviews) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function discount(orig, sale) { return Math.round((1 - sale / orig) * 100); }

function productCardHTML(p) {
  return `<div class="product-card fade-in-up" onclick="showProduct('${p.id}')">
    <div class="relative overflow-hidden">
      <span class="sale-badge">-${discount(p.originalPrice, p.price)}%</span>
      <img src="${p.images[0]}" alt="${p.name}" class="product-card-img" loading="lazy">
      <button class="quick-add" onclick="event.stopPropagation();quickAdd('${p.id}')">Quick Add <i class="fas fa-plus ml-1"></i></button>
    </div>
    <div class="product-info">
      <p class="category-label">${p.category}</p>
      <h3>${p.name}</h3>
      <div class="flex items-center gap-2 mt-1 mb-2">${starsHTML(avgRating(p.reviews))}<span class="text-xs text-slate-400">(${p.reviews.length})</span></div>
      <div class="price-row"><span class="price-current">$${p.price.toFixed(2)}</span><span class="price-original">$${p.originalPrice.toFixed(2)}</span></div>
    </div>
  </div>`;
}

function quickAdd(id) {
  const p = getProductById(id);
  addToCart(id, p.sizes[1] || p.sizes[0], 1);
}

// ── Home Page ──
function renderHome() {
  const catGrid = document.getElementById('homeCategoryGrid');
  const catImages = {};
  CATEGORIES.forEach(c => {
    const prod = PRODUCTS.find(p => p.category === c);
    if(prod) catImages[c] = prod.images[0];
  });
  catGrid.innerHTML = CATEGORIES.map(c => `
    <div class="relative group cursor-pointer overflow-hidden" onclick="filterByCategory('${c}')" style="height:350px">
      <img src="${catImages[c]}" alt="${c}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <h3 class="text-white text-xl font-bold mb-1">${c}</h3>
        <p class="text-white/70 text-sm">${getProductsByCategory(c).length} Products</p>
      </div>
    </div>`).join('');

  document.getElementById('featuredGrid').innerHTML = PRODUCTS.slice(0, 8).map(productCardHTML).join('');
}

// ── Shop Page ──
let activeCategory = 'all';
function renderSidebar() {
  const counts = getCategoryCounts();
  const el = document.getElementById('sidebarCategories');
  el.innerHTML = `<div class="sidebar-item ${activeCategory === 'all' ? 'active' : ''}" onclick="filterByCategory('all')">All Products<span class="sidebar-count">${PRODUCTS.length}</span></div>` +
    CATEGORIES.map(c => `<div class="sidebar-item ${activeCategory === c ? 'active' : ''}" onclick="filterByCategory('${c}')">${c}<span class="sidebar-count">${counts[c]}</span></div>`).join('');
}

function filterByCategory(cat) {
  activeCategory = cat;
  if (cat !== 'all') showView('shop');
  renderSidebar();
  filterProducts();
}

function filterProducts() {
  const maxPrice = parseInt(document.getElementById('priceSlider').value);
  document.getElementById('priceMax').textContent = '$' + maxPrice;
  let filtered = activeCategory === 'all' ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === activeCategory);
  filtered = filtered.filter(p => p.price <= maxPrice);
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = filtered.length ? filtered.map(productCardHTML).join('') :
    '<div class="col-span-full text-center py-20 text-slate-400">No products match your filters.</div>';
}

// ── Product Detail ──
let selectedSize = '';
let selectedQty = 1;

function showProduct(id, addToHistory = true) {
  const p = getProductById(id);
  if (!p) return;
  selectedSize = '';
  selectedQty = 1;
  showView('product', addToHistory, id);
  window.scrollTo(0, 0);

  document.getElementById('productBreadcrumb').innerHTML =
    `<a onclick="showView('home')">Home</a> / <a onclick="showView('shop')">${p.category}</a> / <span class="text-slate-700">${p.name}</span>`;

  const url = encodeURIComponent(window.location.href);
  const txt = encodeURIComponent(`Check out ${p.name} from FJBAIG!`);

  document.getElementById('productDetailContent').innerHTML = `
    <div class="w-full md:w-1/2">
      <img id="mainImg" src="${p.images[0]}" alt="${p.name}" class="w-full aspect-[3/4] object-cover rounded-md shadow-sm">
    </div>
    <div class="w-full md:w-1/2">
      <p class="text-xs uppercase tracking-[2px] text-slate-400 font-semibold mb-1">${p.category}</p>
      <h1 class="font-serif text-3xl font-bold text-slate-900 mb-2">${p.name}</h1>
      <div class="flex items-center gap-2 mb-4">${starsHTML(avgRating(p.reviews))}<span class="text-sm text-slate-400">(${p.reviews.length} reviews)</span></div>
      <div class="flex items-center gap-3 mb-6">
        <span class="text-3xl font-bold text-slate-900">$${p.price.toFixed(2)}</span>
        <span class="text-lg text-slate-400 line-through">$${p.originalPrice.toFixed(2)}</span>
        <span class="bg-red-50 text-red-600 text-xs font-bold px-2 py-1">SAVE ${discount(p.originalPrice, p.price)}%</span>
      </div>
      <p class="text-slate-600 text-sm leading-relaxed mb-8">${p.description}</p>
      <div class="mb-6">
        <p class="text-xs uppercase tracking-[2px] font-semibold text-slate-800 mb-3">Size</p>
        <div class="flex flex-wrap gap-2" id="sizePills">${p.sizes.map(s => `<button class="size-pill" onclick="pickSize('${s}',this)">${s}</button>`).join('')}</div>
      </div>
      <div class="mb-6">
        <p class="text-xs uppercase tracking-[2px] font-semibold text-slate-800 mb-3">Quantity</p>
        <div class="flex items-center"><button class="qty-btn" onclick="changeQty(-1)">−</button><input type="text" class="qty-input" id="qtyInput" value="1" readonly><button class="qty-btn" onclick="changeQty(1)">+</button></div>
      </div>
      <div class="flex gap-3 mb-4">
        <button class="btn-primary flex-1 justify-center" onclick="addToCart('${p.id}',selectedSize,selectedQty)">Add to Cart</button>
        <button class="btn-gold flex-1 justify-center" onclick="buyNow('${p.id}')">Buy Now</button>
        <button class="heart-btn ${isInWishlist(p.id) ? 'active' : ''}" onclick="toggleWishlist('${p.id}');this.classList.toggle('active')"><i class="fas fa-heart"></i></button>
      </div>
      <div class="pt-6 border-t border-slate-100">
        <p class="text-xs uppercase tracking-[2px] font-semibold text-slate-800 mb-3">Share</p>
        <div class="flex gap-2">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" class="share-icon"><i class="fab fa-facebook-f"></i></a>
          <a href="https://twitter.com/intent/tweet?text=${txt}&url=${url}" target="_blank" class="share-icon"><i class="fab fa-twitter"></i></a>
          <a href="https://pinterest.com/pin/create/button/?url=${url}&description=${txt}" target="_blank" class="share-icon"><i class="fab fa-pinterest-p"></i></a>
          <a href="https://wa.me/?text=${txt}%20${url}" target="_blank" class="share-icon"><i class="fab fa-whatsapp"></i></a>
          <button class="share-icon" onclick="navigator.clipboard.writeText(window.location.href);showToast('Link copied!')"><i class="fas fa-link"></i></button>
        </div>
      </div>
    </div>`;

  renderReviews(p);
}

function swapImg(thumb, src) {
  document.getElementById('mainImg').src = src;
  document.querySelectorAll('.thumb-gallery img').forEach(i => i.classList.remove('active'));
  thumb.classList.add('active');
}

function pickSize(size, el) {
  selectedSize = size;
  document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

function changeQty(d) {
  selectedQty = Math.max(1, selectedQty + d);
  document.getElementById('qtyInput').value = selectedQty;
}

function buyNow(id) {
  if (!selectedSize) { showToast('Please select a size', 'error'); return; }
  addToCart(id, selectedSize, selectedQty);
  goToCheckout();
}

function renderReviews(p) {
  const el = document.getElementById('productReviews');
  const avg = avgRating(p.reviews);
  el.innerHTML = `
    <h2 class="font-serif text-2xl font-bold text-slate-900 mb-8">Customer Reviews</h2>
    <div class="flex items-center gap-4 mb-8 p-6 bg-slate-50">
      <div class="text-center"><div class="text-4xl font-bold text-slate-900">${avg.toFixed(1)}</div>${starsHTML(avg)}<p class="text-xs text-slate-400 mt-1">${p.reviews.length} reviews</p></div>
    </div>
    ${p.reviews.map(r => `<div class="review-card"><div class="flex items-center gap-3 mb-2"><div class="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">${r.name[0]}</div><div><p class="font-semibold text-sm text-slate-800">${r.name}</p><p class="text-xs text-slate-400">${r.date}</p></div></div>${starsHTML(r.rating)}<p class="text-sm text-slate-600 mt-2">${r.comment}</p></div>`).join('')}
    <div class="mt-10 p-6 border border-slate-200">
      <h3 class="font-semibold text-lg text-slate-900 mb-4">Leave a Review</h3>
      <form onsubmit="submitReview(event,'${p.id}')">
        <input type="text" placeholder="Your Name" required class="checkout-input mb-3" id="revName">
        <div class="star-rating-input mb-3">${[5,4,3,2,1].map(i => `<input type="radio" name="revRating" id="star${i}" value="${i}" ${i===5?'checked':''}><label for="star${i}">★</label>`).join('')}</div>
        <textarea rows="3" placeholder="Your review..." required class="checkout-input mb-3" id="revComment" style="resize:vertical"></textarea>
        <button type="submit" class="btn-primary">Submit Review</button>
      </form>
    </div>`;
}

function submitReview(e, id) {
  e.preventDefault();
  const p = getProductById(id);
  const rating = parseInt(document.querySelector('input[name="revRating"]:checked').value);
  p.reviews.unshift({ name: document.getElementById('revName').value, rating, comment: document.getElementById('revComment').value, date: new Date().toISOString().split('T')[0] });
  renderReviews(p);
  showToast('Review submitted!', 'success');
}
