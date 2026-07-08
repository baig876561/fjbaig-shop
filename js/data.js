// ============================================================
// FJBAIG — Product Catalog Data (Boys Apparel)
// ============================================================

const PRODUCTS = [
  // ── Boys Hoodies & Sweatshirts ─────────────────────────────
  {
    id: "bh-001",
    name: "Classic Fleece Kangaroo Hoodie",
    price: 28.00,
    originalPrice: 45.00,
    category: "Boys Hoodies & Sweatshirts",
    description: "Our signature Classic Fleece Kangaroo Hoodie is the perfect everyday layer for active boys. Made from ultra-soft, premium cotton-blend fleece, it features a roomy kangaroo pocket, ribbed cuffs, and a lined hood for extra warmth. The unbranded minimalist design ensures it matches any outfit seamlessly.",
    sizes: ["2T", "3T", "4T", "5T", "6Y"],
    images: [
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=600&auto=format&fit=crop"
    ],
    reviews: [
      { name: "Sarah L.", rating: 5, comment: "My 4-year-old refuses to take this hoodie off! The fleece is so soft and thick.", date: "2026-06-15" },
      { name: "Mike T.", rating: 4, comment: "Great basic hoodie. True to size and washed really well without shrinking.", date: "2026-06-02" }
    ]
  },
  {
    id: "bh-002",
    name: "Minimalist Crewneck Sweatshirt",
    price: 24.00,
    originalPrice: 38.00,
    category: "Boys Hoodies & Sweatshirts",
    description: "A staple for any boy's wardrobe, this Minimalist Crewneck Sweatshirt offers incredible comfort without the bulk. Crafted from medium-weight French terry cotton, it features a relaxed fit, reinforced stitching at the seams, and a classic crew neckline. Perfect for school or casual weekend play.",
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop"
    ],
    reviews: [
      { name: "Jessica M.", rating: 5, comment: "Love the minimalist look. No loud logos, just pure comfort.", date: "2026-06-18" },
      { name: "David K.", rating: 5, comment: "The crewneck collar holds its shape beautifully after multiple washes.", date: "2026-05-20" }
    ]
  },
  {
    id: "bh-003",
    name: "Full-Zip French Terry Jacket",
    price: 32.00,
    originalPrice: 50.00,
    category: "Boys Hoodies & Sweatshirts",
    description: "Versatile and stylish, this Full-Zip French Terry Jacket is ideal for layering across seasons. It boasts a smooth exterior with a cozy looped back inside. Features include a heavy-duty YKK front zipper, deep front pockets, and a structured collar that can be worn up or folded down.",
    sizes: ["3Y", "5Y", "7Y", "9Y"],
    images: [
      "https://americantall.com/cdn/shop/files/American-Tall-Men-80-20-French-Terry-Full-Zip-Hoodie-Charcoal-Mix-Front_52473dc8-2773-485b-81d5-77359391c5d6.jpg?v=1779997230"
    ],
    reviews: [
      { name: "Emily R.", rating: 5, comment: "The zipper is very high quality and easy for my 5-year-old to use himself.", date: "2026-06-10" },
      { name: "Brian W.", rating: 4, comment: "Great light jacket for spring/fall weather.", date: "2026-05-28" }
    ]
  },

  // ── Boys Everyday T-Shirts ─────────────────────────────────
  {
    id: "bt-001",
    name: "Organic Cotton Crewneck Tee",
    price: 14.00,
    originalPrice: 22.00,
    category: "Boys Everyday T-Shirts",
    description: "Simple, breathable, and essential. This Organic Cotton Crewneck Tee is made from 100% certified organic cotton, ensuring it is gentle on sensitive skin. The lightweight fabric keeps boys cool during summer, while the durable construction means it will survive the playground.",
    sizes: ["2T", "3T", "4T", "5T", "6Y", "7Y"],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop"
    ],
    reviews: [
      { name: "Amanda P.", rating: 5, comment: "The organic cotton makes such a huge difference! So soft.", date: "2026-06-25" },
      { name: "Chris H.", rating: 4, comment: "Bought 5 of these for my son's summer wardrobe. Excellent value.", date: "2026-06-05" }
    ]
  },
  {
    id: "bt-002",
    name: "Waffle-Knit Long Sleeve Tee",
    price: 18.00,
    originalPrice: 28.00,
    category: "Boys Everyday T-Shirts",
    description: "Add texture to his wardrobe with this premium Waffle-Knit Long Sleeve Tee. The thermal waffle weave traps heat to keep him warm on chilly days while remaining breathable. Features banded cuffs to keep sleeves in place and a slightly curved hem for a modern look.",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    images: [
      "https://m.media-amazon.com/images/I/71rW7lhc9bL._AC_UY1000_.jpg"
    ],
    reviews: [
      { name: "Rachel D.", rating: 5, comment: "The waffle texture is gorgeous and the fit is perfect.", date: "2026-06-14" },
      { name: "Tom S.", rating: 5, comment: "Great long sleeve for transitioning into autumn weather.", date: "2026-05-18" }
    ]
  },
  {
    id: "bt-003",
    name: "Heavyweight Pocket Tee",
    price: 16.00,
    originalPrice: 25.00,
    category: "Boys Everyday T-Shirts",
    description: "Built for durability. This Heavyweight Pocket Tee utilizes dense, rugged cotton that holds its shape and stands up to rough-and-tumble play. A classic front chest pocket adds a touch of style to this otherwise minimalist essential.",
    sizes: ["3Y", "5Y", "7Y", "9Y"],
    images: [
      "https://cdnp.sanmar.com/medias/sys_master/images/hb6/hc3/28686940176414/1200W_9676_Chambray-0-4410ChambrayModelFront3/1200W-9676-Chambray-0-4410ChambrayModelFront3.jpg"
    ],
    reviews: [
      { name: "Lauren C.", rating: 5, comment: "Finally a t-shirt that doesn't get holes after two weeks! Very thick cotton.", date: "2026-06-20" },
      { name: "Mark B.", rating: 4, comment: "The little pocket detail is so cute. Will buy more.", date: "2026-05-22" }
    ]
  },

  // ── Boys Active Shorts & Joggers ───────────────────────────
  {
    id: "bp-001",
    name: "French Terry Drawstring Shorts",
    price: 16.00,
    originalPrice: 26.00,
    category: "Boys Active Shorts & Joggers",
    description: "The ultimate play short. These French Terry Drawstring Shorts offer an elastic waistband with a functional drawstring for a customized fit. The soft terry fabric moves effortlessly, making them the go-to choice for sports, lounging, or summer camps.",
    sizes: ["2T", "3T", "4T", "5T", "6Y"],
    images: [
      "https://oldnavy.com.ph/cdn/shop/products/cn52753228_1200x.jpg?v=1684301853"
    ],
    reviews: [
      { name: "Nicole W.", rating: 5, comment: "The functional drawstring is great because my son is very slim.", date: "2026-06-19" },
      { name: "Steve G.", rating: 5, comment: "Comfortable and durable. He wears them to soccer practice all the time.", date: "2026-06-08" }
    ]
  },
  {
    id: "bp-002",
    name: "Classic Cotton Slim-Fit Joggers",
    price: 26.00,
    originalPrice: 42.00,
    category: "Boys Active Shorts & Joggers",
    description: "Upgrade his activewear with these Classic Cotton Slim-Fit Joggers. They feature a modern tapered leg, cuffed ankles, and side zip pockets to keep small items secure. The premium stretch-cotton blend ensures he looks sharp while staying completely comfortable.",
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    images: [
      "https://galaxybyharvic.com/cdn/shop/files/BJP-301-BLACK-MODEL.jpg?v=1689014697&width=1946"
    ],
    reviews: [
      { name: "Heather F.", rating: 5, comment: "Love the slim fit! They look much nicer than regular baggy sweatpants.", date: "2026-06-17" },
      { name: "Jason L.", rating: 4, comment: "The zip pockets are a fantastic feature. Good quality joggers.", date: "2026-05-30" }
    ]
  },
  {
    id: "bp-003",
    name: "Lightweight Canvas Cargo Shorts",
    price: 22.00,
    originalPrice: 36.00,
    category: "Boys Active Shorts & Joggers",
    description: "Ready for adventure. These Lightweight Canvas Cargo Shorts combine the rugged utility of classic cargos with a breathable, lightweight fabric suited for hot days. Ample pocket space lets him carry all his treasures, while the adjustable inner waist ensures a perfect fit.",
    sizes: ["3Y", "5Y", "7Y", "9Y", "11Y"],
    images: [
      "https://image.hm.com/assets/hm/6d/03/6d03298dba218144c6bfb7d7df782e6c32581953.jpg?imwidth=2160"
    ],
    reviews: [
      { name: "Megan T.", rating: 5, comment: "Very well made shorts. The canvas is sturdy but not stiff.", date: "2026-06-12" },
      { name: "Oliver P.", rating: 5, comment: "My son loves all the pockets. Will definitely be ordering the next size up.", date: "2026-05-15" }
    ]
  }
];

// ── Category Helpers ────────────────────────────────────────
const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

function getProductsByCategory(cat) {
  return PRODUCTS.filter(p => p.category === cat);
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getCategoryCounts() {
  const counts = {};
  CATEGORIES.forEach(c => { counts[c] = PRODUCTS.filter(p => p.category === c).length; });
  return counts;
}
