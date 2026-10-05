BALAN E-COMMERCE WEBSITE
A complete, full-stack e-commerce marketplace and administration platform built with React.js, Tailwind CSS, Node.js, Express.js, and MongoDB Atlas with Mongoose.
Features an original, human-crafted design focused on typography, responsive layouts, product discovery, Cash on Delivery (COD) checkout, order tracking, and an isolated, secure Admin Management Suite.
📑 Table of Contents
Features
Technology Stack
Folder Structure
Getting Started & Installation
Environment Variables
MongoDB Atlas Setup
Default Accounts & Credentials
Available Scripts
Render Deployment Guide
Troubleshooting
✨ Features
Customer Experience (User Module)
Original Storefront Design: Curated hero showcase, typography hierarchy, zero AI-slop styling.
Product Catalog Browsing: Real-time category filtering (Electronics, Footwear & Leather, Apparel, Horology, Home & Living, Grooming).
Search & Sort: Search by title, keywords, or description; sort by Newest, Most Popular, Price: Low to High, Price: High to Low, or In Stock Only.
Product Details (PDP): Contiguous purchase module, stock availability, dynamic discount calculation, image gallery with resilient fallbacks, and specifications tabs.
Interactive Shopping Bag: Quantity steppers, maximum stock limits, item removal, free shipping threshold indicator ($150 threshold).
Checkout & Cash on Delivery (COD): Complete address entry (street, city, state, pincode, instructions), order total computation, cash payment upon doorstep handover.
Order Placement: Stock deduction from database, cart clearing, unique Order ID generation (BLN-XXXXXX), and instant receipt redirection.
My Orders Portal: Order history with chronological status badges (Pending, Confirmed, Shipped, Delivered, Cancelled), item breakdowns, and delivery address verification.
Customer Authentication: Secure registration and login with bcrypt password hashing and JWT sessions.
Admin Management Module
Protected Administrator Suite: Accessible at /admin/login and restricted to admin credentials.
Live KPI Analytics Dashboard: Real-time metrics from the database: Total Revenue, Total Orders, Pending Orders, Delivered Orders, Catalog Products, and Registered Customers.
Product Management (CRUD): Create new products, edit price/discount/stock/availability, delete items with confirmation, and live card preview.
Fulfillment & Order Control: Filter orders by status, inspect customer contacts and shipping addresses, and update status dropdown with instant persistence.
Customer Roster: View registered customer profiles, registration dates, order counts, and lifetime spend.
🛠 Technology Stack
Frontend: React 19, React Router v7, Tailwind CSS v4, Lucide Icons
Backend: Node.js, Express.js, TypeScript (tsx)
Database: MongoDB Atlas via Mongoose with resilient fallback mode
Security: bcryptjs password hashing, jsonwebtoken (JWT), CORS
Build & Dev Tooling: Vite 8, TypeScript
📂 Folder Structure
code
Text
├── server.ts                  # Central full-stack Express server (Vite middleware in dev, static in prod)
├── server/
│   ├── config/
│   │   └── db.ts              # MongoDB Atlas connection & status monitor
│   ├── controllers/
│   │   ├── authController.ts  # Customer & admin auth logic
│   │   ├── productController.ts # Catalog CRUD & filtering
│   │   ├── cartController.ts  # Shopping bag manipulation
│   │   ├── orderController.ts # Order placement & history
│   │   └── adminController.ts # Dashboard analytics & order dispatching
│   ├── data/
│   │   ├── seedData.ts        # Initial curated catalog items & categories
│   │   └── store.ts           # Unified data layer (Mongoose models + resilient fallback)
│   ├── middleware/
│   │   └── auth.ts            # JWT verification & admin route guards
│   ├── models/
│   │   ├── User.ts            # Mongoose User schema
│   │   ├── Product.ts         # Mongoose Product schema
│   │   ├── Cart.ts            # Mongoose Cart schema
│   │   └── Order.ts           # Mongoose Order schema
│   └── routes/
│       ├── authRoutes.ts
│       ├── productRoutes.ts
│       ├── cartRoutes.ts
│       ├── orderRoutes.ts
│       └── adminRoutes.ts
├── src/
│   ├── assets/images/         # Studio generated commercial assets
│   ├── components/
│   │   ├── Navbar.tsx         # 3-zone top bar contract
│   │   ├── Footer.tsx         # Policy & catalog footer
│   │   ├── ProductCard.tsx    # Unboxed metadata & quick-add card
│   │   ├── ImageWithFallback.tsx # Zero-broken-image policy container
│   │   ├── ProtectedRoute.tsx # Route authentication guards
│   │   └── AdminLayout.tsx    # Management console navigation sidebar
│   ├── context/
│   │   ├── AuthContext.tsx    # Customer and admin sessions
│   │   ├── CartContext.tsx    # Cart state & quantities
│   │   └── ToastContext.tsx   # Action notifications
│   ├── pages/
│   │   ├── Home.tsx           # Storefront hero & catalog
│   │   ├── ProductDetail.tsx  # PDP contiguous purchase module
│   │   ├── Cart.tsx           # Shopping bag
│   │   ├── Checkout.tsx       # Address & Cash on Delivery
│   │   ├── OrderSuccess.tsx   # Receipt confirmation
│   │   ├── MyOrders.tsx       # Customer order history
│   │   ├── Login.tsx          # Customer sign in
│   │   ├── Register.tsx       # Customer registration
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProducts.tsx
│   │       ├── AdminProductForm.tsx
│   │       ├── AdminOrders.tsx
│   │       └── AdminCustomers.tsx
│   ├── services/
│   │   └── api.ts             # Centralized REST API service
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
└── tsconfig.json
🚀 Getting Started & Installation
Prerequisites
Node.js (v18 or later)
npm (v9 or later)
MongoDB Atlas account (optional for local evaluation; resilient mode activates if no URI is supplied)
Step 1: Clone Repository & Install Dependencies
code
Bash
git clone <your-repository-url>
cd balan-ecommerce
npm install
Step 2: Configure Environment
Copy the example environment file:
code
Bash
cp .env.example .env
Edit .env and set:
code
Env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/balan_ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
Step 3: Run the Development Server
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
🔑 Default Accounts & Credentials
The platform is pre-seeded with sample credentials:
1. Administrator Account
Portal URL: /admin/login
Email: admin@balan.com
Password: admin123
(A convenient "Fill Admin" button is available on the admin login page for rapid evaluation)
2. Sample Customer Account
Portal URL: /login
Email: customer@example.com
Password: password123
(A convenient "Auto Fill" button is available on the customer login page)
🗄 MongoDB Atlas Setup
Create a free M0 cluster on MongoDB Atlas.
Under Database Access, create a user with read/write privileges (e.g., balan_admin).
Under Network Access, add 0.0.0.0/0 (allow access from anywhere) so Render and your local environment can connect.
Click Connect 
 Connect your application (Drivers: Node.js) and copy the connection string.
Paste into your .env as MONGODB_URI.
On startup, the server automatically connects, creates the collections (users, products, carts, orders), and inserts the initial catalog if empty.
🌐 Render Deployment Guide
To deploy the full-stack application on Render:
Commit and Push your code to GitHub:
code
Bash
git add .
git commit -m "Update Render deployment configuration and ESM root path"
git push origin main
Log into the Render Dashboard and click New + 
 Web Service.
Select your GitHub repository (balan-ecommerce or balan-kart).
Configure service settings:
Name: balan-kart (or your preferred name)
Language / Environment: Node (or Bun)
Branch: main
Region: Any preferred region (e.g. Singapore, Frankfurt, Oregon)
Build Command:
code
Bash
npm install && npm run build
Start Command:
code
Bash
npm start
Under Environment Variables (or Environment Secrets), add:
NODE_ENV: production
MONGODB_URI: mongodb+srv://tharun3430_db_user:TWVk4PU31A5mziYQ@cluster0.yfgph06.mongodb.net/balan_ecommerce?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET: Balan12345
PORT: 10000 (Render sets this automatically)
Click Create Web Service (or Manual Deploy → Clear build cache & deploy).
Once deployed, visit your live URL: https://balan-kart.onrender.com!
📜 Available Scripts
npm run dev: Starts the full-stack Express server with Vite middleware in development mode on port 3000.
npm run build: Compiles the client code into the production dist/ directory.
npm start: Runs the production server (tsx server.ts), serving the static client build and REST API.
npm run lint: Performs TypeScript validation across the codebase without emitting artifacts.