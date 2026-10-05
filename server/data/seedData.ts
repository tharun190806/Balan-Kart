export interface SeedProduct {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  image: string;
  stock: number;
  availability: boolean;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
}

export const initialProducts: SeedProduct[] = [
  {
    _id: 'prod_balan_001',
    name: 'Balan Studio Acoustic Monitor MK-II',
    category: 'Electronics',
    description: 'Precision engineered over-ear studio monitoring headphones. Features 50mm custom neodymium drivers, memory foam lambskin earcups, brushed aerospace-grade aluminum chassis, and ultra-low distortion acoustic chamber tuning.',
    price: 349,
    discount: 15,
    finalPrice: 297,
    image: '/src/assets/images/product_studio_headphones_1791212374711.jpg',
    stock: 28,
    availability: true,
    featured: true,
    rating: 4.9,
    reviewsCount: 84
  },
  {
    _id: 'prod_balan_002',
    name: 'Handcrafted Cognac Leather Weekender',
    category: 'Footwear & Leather',
    description: 'Vegetable-tanned full-grain Italian leather duffel bag. Equipped with solid antique brass hardware, reinforced luggage handles, waterproof canvas interior lining, and dedicated ventilated shoe compartment.',
    price: 480,
    discount: 10,
    finalPrice: 432,
    image: '/src/assets/images/product_leather_bag_1791212390598.jpg',
    stock: 14,
    availability: true,
    featured: true,
    rating: 5.0,
    reviewsCount: 62
  },
  {
    _id: 'prod_balan_003',
    name: 'Ceramic Obsidian Automatic Watch',
    category: 'Accessories & Horology',
    description: 'Minimalist mechanical dress watch featuring a micro-beaded matte black ceramic casing, double-domed anti-reflective sapphire crystal, Japanese automatic movement with 42-hour power reserve, and textured calfskin strap.',
    price: 620,
    discount: 20,
    finalPrice: 496,
    image: '/src/assets/images/product_ceramic_watch_1791212409252.jpg',
    stock: 19,
    availability: true,
    featured: true,
    rating: 4.8,
    reviewsCount: 45
  },
  {
    _id: 'prod_balan_004',
    name: 'Architectural Cast Brass Desk Organiser',
    category: 'Home & Living',
    description: 'Heavy solid cast brass desktop organizer tray with geometric pen flute and magnetic card slot. Finished with hand-rubbed wax patina that matures gracefully over years of daily desk use.',
    price: 135,
    discount: 0,
    finalPrice: 135,
    image: '/src/assets/images/balan_hero_showcase_1791212357603.jpg',
    stock: 35,
    availability: true,
    featured: false,
    rating: 4.7,
    reviewsCount: 31
  },
  {
    _id: 'prod_balan_005',
    name: 'Heavyweight Raw Cotton Oversized Hoodie',
    category: 'Clothing & Apparel',
    description: '480 GSM French Terry combed organic cotton hoodie. Pre-shrunk custom drape, seamless double-layer hood, hidden interior card pocket, and ribbed cuffs constructed to withstand decades of wear.',
    price: 160,
    discount: 12,
    finalPrice: 141,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    stock: 42,
    availability: true,
    featured: true,
    rating: 4.8,
    reviewsCount: 97
  },
  {
    _id: 'prod_balan_006',
    name: 'Japanese Selvedge Denim Field Trousers',
    category: 'Clothing & Apparel',
    description: '14.5oz shuttle-loom Japanese selvedge denim in deep indigo. Straight relaxed cut with copper rivets, chain-stitched hems, and natural vegetable-tanned leather back patch.',
    price: 210,
    discount: 5,
    finalPrice: 200,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    stock: 22,
    availability: true,
    featured: false,
    rating: 4.9,
    reviewsCount: 53
  },
  {
    _id: 'prod_balan_007',
    name: 'Travertine & Smoked Glass Pour-Over Set',
    category: 'Home & Living',
    description: 'Hand-carved beige travertine stone base paired with heat-resistant borosilicate smoked glass dripper and server. Designed for precise flow control and exceptional thermal retention during manual brew extraction.',
    price: 115,
    discount: 0,
    finalPrice: 115,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    stock: 18,
    availability: true,
    featured: false,
    rating: 4.7,
    reviewsCount: 29
  },
  {
    _id: 'prod_balan_008',
    name: 'Nordic Low-Profile Chelsea Boots',
    category: 'Footwear & Leather',
    description: 'Waxed suede Chelsea boots crafted with Goodyear-welt construction, water-repellent oiled finish, storm welt protection, and durable Vibram lug soles for all-weather urban traction.',
    price: 290,
    discount: 15,
    finalPrice: 247,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    stock: 16,
    availability: true,
    featured: true,
    rating: 4.8,
    reviewsCount: 38
  },
  {
    _id: 'prod_balan_009',
    name: 'Anodized Mechanical Keypad & Dial',
    category: 'Electronics',
    description: 'CNC machined 6063 aluminum macropad with hot-swappable tactile switches, programmable rotary encoder for media and CAD scrub control, and seamless USB-C high-speed polling.',
    price: 145,
    discount: 10,
    finalPrice: 130,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    stock: 30,
    availability: true,
    featured: false,
    rating: 4.9,
    reviewsCount: 71
  },
  {
    _id: 'prod_balan_010',
    name: 'Botanical Hinoki & Vetiver Parfum 50ml',
    category: 'Grooming & Fragrance',
    description: 'Concentrated extrait de parfum blending wild Japanese Hinoki cypress, Haitian vetiver root, crushed black pepper, and warm amber resin. Hand-blended in small seasonal batches.',
    price: 175,
    discount: 0,
    finalPrice: 175,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    availability: true,
    featured: false,
    rating: 4.8,
    reviewsCount: 44
  },
  {
    _id: 'prod_balan_011',
    name: 'Merino Wool Ribbed Beanie & Scarf Set',
    category: 'Accessories & Horology',
    description: '100% extra-fine Italian merino wool knitwear set. Ultra-soft zero-itch feel with natural thermo-regulating properties, finished with clean minimal ribbed hems in charcoal heather.',
    price: 120,
    discount: 15,
    finalPrice: 102,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    stock: 34,
    availability: true,
    featured: false,
    rating: 4.7,
    reviewsCount: 22
  },
  {
    _id: 'prod_balan_012',
    name: 'Matte Ceramic Wireless Charging Dock',
    category: 'Electronics',
    description: 'Dual fast wireless charging station crafted in weighted matte ceramic and spun aluminum. Delivers optimal 15W Qi charging for phones and earbuds with intelligent temperature management.',
    price: 95,
    discount: 0,
    finalPrice: 95,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    availability: true,
    featured: false,
    rating: 4.6,
    reviewsCount: 56
  }
];

export const CATEGORIES = [
  'All Products',
  'Electronics',
  'Clothing & Apparel',
  'Footwear & Leather',
  'Home & Living',
  'Accessories & Horology',
  'Grooming & Fragrance'
];
