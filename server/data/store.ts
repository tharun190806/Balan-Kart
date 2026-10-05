import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel, IUser } from '../models/User.ts';
import { ProductModel, IProduct } from '../models/Product.ts';
import { CartModel, ICart } from '../models/Cart.ts';
import { OrderModel, IOrder } from '../models/Order.ts';
import { initialProducts, SeedProduct } from './seedData.ts';

// In-memory persistent state (mirrors Mongoose collections)
interface MemoryState {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    address?: { street?: string; city?: string; state?: string; pincode?: string };
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
  }>;
  products: Array<SeedProduct & { createdAt: Date; updatedAt: Date }>;
  carts: Array<{
    _id: string;
    user: string;
    items: Array<{ product: string; quantity: number }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  orders: Array<{
    _id: string;
    orderId: string;
    user?: string;
    customerDetails: { fullName: string; email: string; phone: string };
    deliveryAddress: { street: string; city: string; state: string; pincode: string };
    items: Array<{ product: string; name: string; price: number; quantity: number; image: string }>;
    totalAmount: number;
    deliveryCharge: number;
    paymentMethod: 'Cash on Delivery';
    orderStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

const memoryState: MemoryState = {
  users: [],
  products: [],
  carts: [],
  orders: [],
};

// Initialize seed data
export async function initializeDataStore() {
  const isMongoReady = mongoose.connection.readyState === 1;
  const adminHashedPassword = await bcrypt.hash('admin123', 10);
  const customerHashedPassword = await bcrypt.hash('password123', 10);

  // Initialize Memory fallback if empty
  if (memoryState.users.length === 0) {
    memoryState.users = [
      {
        _id: 'usr_admin_001',
        name: 'Balan Administrator',
        email: 'admin@balan.com',
        phone: '+1 555-019-2834',
        password: adminHashedPassword,
        address: { street: '100 Curated Plaza', city: 'Metropolis', state: 'NY', pincode: '10001' },
        role: 'admin',
        createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000),
        updatedAt: new Date(),
      },
      {
        _id: 'usr_cust_001',
        name: 'Alexander Wright',
        email: 'customer@example.com',
        phone: '+1 555-014-9821',
        password: customerHashedPassword,
        address: { street: '42 Highfield Terrace', city: 'Brooklyn', state: 'NY', pincode: '11201' },
        role: 'user',
        createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000),
        updatedAt: new Date(),
      },
    ];

    memoryState.products = initialProducts.map((p) => ({
      ...p,
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000),
      updatedAt: new Date(),
    }));

    // Add initial sample orders for Alexander
    memoryState.orders = [
      {
        _id: 'ord_sample_001',
        orderId: 'BLN-892401',
        user: 'usr_cust_001',
        customerDetails: {
          fullName: 'Alexander Wright',
          email: 'customer@example.com',
          phone: '+1 555-014-9821',
        },
        deliveryAddress: {
          street: '42 Highfield Terrace',
          city: 'Brooklyn',
          state: 'NY',
          pincode: '11201',
        },
        items: [
          {
            product: 'prod_balan_001',
            name: 'Balan Studio Acoustic Monitor MK-II',
            price: 297,
            quantity: 1,
            image: '/src/assets/images/product_studio_headphones_1791212374711.jpg',
          },
          {
            product: 'prod_balan_004',
            name: 'Architectural Cast Brass Desk Organiser',
            price: 135,
            quantity: 1,
            image: '/src/assets/images/balan_hero_showcase_1791212357603.jpg',
          },
        ],
        totalAmount: 432,
        deliveryCharge: 0,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Delivered',
        notes: 'Deliver to front desk if not home.',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        _id: 'ord_sample_002',
        orderId: 'BLN-892499',
        user: 'usr_cust_001',
        customerDetails: {
          fullName: 'Alexander Wright',
          email: 'customer@example.com',
          phone: '+1 555-014-9821',
        },
        deliveryAddress: {
          street: '42 Highfield Terrace',
          city: 'Brooklyn',
          state: 'NY',
          pincode: '11201',
        },
        items: [
          {
            product: 'prod_balan_003',
            name: 'Ceramic Obsidian Automatic Watch',
            price: 496,
            quantity: 1,
            image: '/src/assets/images/product_ceramic_watch_1791212409252.jpg',
          },
        ],
        totalAmount: 496,
        deliveryCharge: 0,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Confirmed',
        notes: 'Call on arrival.',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        updatedAt: new Date(),
      },
    ];
  }

  // If MongoDB is connected, seed MongoDB if empty
  if (isMongoReady) {
    try {
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        await UserModel.create([
          {
            name: 'Balan Administrator',
            email: 'admin@balan.com',
            phone: '+1 555-019-2834',
            password: adminHashedPassword,
            address: { street: '100 Curated Plaza', city: 'Metropolis', state: 'NY', pincode: '10001' },
            role: 'admin',
          },
          {
            name: 'Alexander Wright',
            email: 'customer@example.com',
            phone: '+1 555-014-9821',
            password: customerHashedPassword,
            address: { street: '42 Highfield Terrace', city: 'Brooklyn', state: 'NY', pincode: '11201' },
            role: 'user',
          },
        ]);
        console.log('🌱 [MongoDB Atlas] Seeded default users (admin & customer).');
      }

      const productCount = await ProductModel.countDocuments();
      if (productCount === 0) {
        const docs = initialProducts.map((p) => ({
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price,
          discount: p.discount,
          finalPrice: p.finalPrice,
          image: p.image,
          stock: p.stock,
          availability: p.availability,
          featured: p.featured,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
        }));
        await ProductModel.insertMany(docs);
        console.log(`🌱 [MongoDB Atlas] Seeded ${docs.length} initial products.`);
      }
    } catch (err: any) {
      console.error('Error seeding MongoDB collections:', err.message);
    }
  }
}

// ----------------- Unified Data Access -----------------

export const dataStore = {
  // Users
  users: {
    findByEmail: async (email: string) => {
      const cleanEmail = email.toLowerCase().trim();
      if (mongoose.connection.readyState === 1) {
        return await UserModel.findOne({ email: cleanEmail }).lean();
      }
      return memoryState.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
    },
    findById: async (id: string) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
        return await UserModel.findById(id).select('-password').lean();
      }
      const u = memoryState.users.find((x) => x._id === id);
      if (!u) return null;
      const { password, ...rest } = u;
      return rest;
    },
    create: async (userData: any) => {
      if (mongoose.connection.readyState === 1) {
        const created = await UserModel.create(userData);
        return created.toObject();
      }
      const newUser = {
        _id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: userData.name,
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone,
        password: userData.password,
        address: userData.address || {},
        role: (userData.role || 'user') as 'user' | 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryState.users.push(newUser);
      return newUser;
    },
    getAllCustomers: async () => {
      if (mongoose.connection.readyState === 1) {
        const users = await UserModel.find({ role: 'user' }).select('-password').lean();
        const orders = await OrderModel.find().lean();
        return users.map((u: any) => {
          const userOrders = orders.filter((o: any) => o.user && o.user.toString() === u._id.toString());
          const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
          return {
            ...u,
            orderCount: userOrders.length,
            totalSpent,
          };
        });
      }
      return memoryState.users
        .filter((u) => u.role === 'user')
        .map((u) => {
          const userOrders = memoryState.orders.filter((o) => o.user === u._id);
          const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          const { password, ...rest } = u;
          return {
            ...rest,
            orderCount: userOrders.length,
            totalSpent,
          };
        });
    },
  },

  // Products
  products: {
    find: async (query: { search?: string; category?: string; sort?: string; inStock?: boolean }) => {
      let items: any[] = [];
      if (mongoose.connection.readyState === 1) {
        const filter: any = {};
        if (query.category && query.category !== 'All Products') {
          filter.category = query.category;
        }
        if (query.inStock) {
          filter.stock = { $gt: 0 };
        }
        if (query.search && query.search.trim()) {
          const s = query.search.trim();
          filter.$or = [
            { name: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
            { category: { $regex: s, $options: 'i' } },
          ];
        }

        let sortOption: any = { createdAt: -1 };
        if (query.sort === 'price_asc') sortOption = { finalPrice: 1 };
        if (query.sort === 'price_desc') sortOption = { finalPrice: -1 };
        if (query.sort === 'popular') sortOption = { rating: -1, reviewsCount: -1 };
        if (query.sort === 'newest') sortOption = { createdAt: -1 };

        items = await ProductModel.find(filter).sort(sortOption).lean();
      } else {
        items = [...memoryState.products];

        if (query.category && query.category !== 'All Products') {
          items = items.filter((p) => p.category.toLowerCase() === query.category?.toLowerCase());
        }
        if (query.inStock) {
          items = items.filter((p) => p.stock > 0);
        }
        if (query.search && query.search.trim()) {
          const term = query.search.toLowerCase().trim();
          items = items.filter(
            (p) =>
              p.name.toLowerCase().includes(term) ||
              p.description.toLowerCase().includes(term) ||
              p.category.toLowerCase().includes(term)
          );
        }

        if (query.sort === 'price_asc') {
          items.sort((a, b) => a.finalPrice - b.finalPrice);
        } else if (query.sort === 'price_desc') {
          items.sort((a, b) => b.finalPrice - a.finalPrice);
        } else if (query.sort === 'popular') {
          items.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        } else {
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }
      return items;
    },

    findById: async (id: string) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
        return await ProductModel.findById(id).lean();
      }
      return memoryState.products.find((p) => p._id.toString() === id.toString()) || null;
    },

    create: async (productData: any) => {
      const discount = Number(productData.discount) || 0;
      const price = Number(productData.price);
      const finalPrice = Math.max(0, Math.round(price - (price * discount) / 100));
      const stock = Number(productData.stock) || 0;
      const availability = stock > 0 && productData.availability !== false;

      if (mongoose.connection.readyState === 1) {
        const created = await ProductModel.create({
          ...productData,
          price,
          discount,
          finalPrice,
          stock,
          availability,
        });
        return created.toObject();
      }

      const newProduct: any = {
        _id: 'prod_' + Math.random().toString(36).substring(2, 9),
        name: productData.name,
        category: productData.category,
        description: productData.description,
        price,
        discount,
        finalPrice,
        image: productData.image,
        stock,
        availability,
        featured: !!productData.featured,
        rating: 4.8,
        reviewsCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryState.products.unshift(newProduct);
      return newProduct;
    },

    update: async (id: string, updateData: any) => {
      if (updateData.price !== undefined || updateData.discount !== undefined) {
        const current = await dataStore.products.findById(id);
        const price = updateData.price !== undefined ? Number(updateData.price) : current?.price || 0;
        const discount = updateData.discount !== undefined ? Number(updateData.discount) : current?.discount || 0;
        updateData.finalPrice = Math.max(0, Math.round(price - (price * discount) / 100));
      }
      if (updateData.stock !== undefined) {
        updateData.stock = Number(updateData.stock);
        if (updateData.stock <= 0) {
          updateData.availability = false;
        }
      }

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
      }

      const idx = memoryState.products.findIndex((p) => p._id.toString() === id.toString());
      if (idx === -1) return null;
      memoryState.products[idx] = {
        ...memoryState.products[idx],
        ...updateData,
        updatedAt: new Date(),
      };
      return memoryState.products[idx];
    },

    delete: async (id: string) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
        const res = await ProductModel.findByIdAndDelete(id);
        return !!res;
      }
      const initialLen = memoryState.products.length;
      memoryState.products = memoryState.products.filter((p) => p._id.toString() !== id.toString());
      return memoryState.products.length < initialLen;
    },

    reduceStock: async (productId: string, quantity: number) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(productId)) {
        const product = await ProductModel.findById(productId);
        if (!product) return false;
        product.stock = Math.max(0, product.stock - quantity);
        if (product.stock === 0) product.availability = false;
        await product.save();
        return true;
      }

      const p = memoryState.products.find((item) => item._id.toString() === productId.toString());
      if (!p) return false;
      p.stock = Math.max(0, p.stock - quantity);
      if (p.stock === 0) p.availability = false;
      p.updatedAt = new Date();
      return true;
    },
  },

  // Cart
  cart: {
    getByUser: async (userId: string) => {
      let cartItems: Array<{ product: any; quantity: number }> = [];

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        const cart = await CartModel.findOne({ user: userId }).populate('items.product').lean();
        if (cart && Array.isArray(cart.items)) {
          cartItems = cart.items
            .filter((i: any) => i.product)
            .map((i: any) => ({
              product: i.product,
              quantity: i.quantity,
            }));
        }
      } else {
        const userCart = memoryState.carts.find((c) => c.user === userId);
        if (userCart) {
          cartItems = userCart.items
            .map((item) => {
              const product = memoryState.products.find((p) => p._id.toString() === item.product.toString());
              if (!product) return null;
              return { product, quantity: item.quantity };
            })
            .filter(Boolean) as any[];
        }
      }

      const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      const subtotal = cartItems.reduce((acc, item) => acc + item.product.finalPrice * item.quantity, 0);
      const deliveryCharge = subtotal > 150 || subtotal === 0 ? 0 : 15;
      const totalAmount = subtotal + deliveryCharge;

      return {
        items: cartItems,
        totalItems,
        subtotal,
        deliveryCharge,
        totalAmount,
      };
    },

    addItem: async (userId: string, productId: string, quantity = 1) => {
      const product = await dataStore.products.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      if (product.stock < quantity) {
        throw new Error(`Only ${product.stock} items left in stock`);
      }

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        let cart = await CartModel.findOne({ user: userId });
        if (!cart) {
          cart = await CartModel.create({ user: userId, items: [] });
        }
        const existingIdx = cart.items.findIndex(
          (i: any) => i.product.toString() === productId.toString()
        );
        if (existingIdx > -1) {
          const newQty = cart.items[existingIdx].quantity + quantity;
          if (newQty > product.stock) {
            throw new Error(`Cannot add more. Maximum available stock is ${product.stock}`);
          }
          cart.items[existingIdx].quantity = newQty;
        } else {
          cart.items.push({ product: productId as any, quantity });
        }
        await cart.save();
        return await dataStore.cart.getByUser(userId);
      }

      let cart = memoryState.carts.find((c) => c.user === userId);
      if (!cart) {
        cart = {
          _id: 'cart_' + Math.random().toString(36).substring(2, 9),
          user: userId,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryState.carts.push(cart);
      }

      const itemIdx = cart.items.findIndex((i) => i.product.toString() === productId.toString());
      if (itemIdx > -1) {
        const newQty = cart.items[itemIdx].quantity + quantity;
        if (newQty > product.stock) {
          throw new Error(`Cannot add more. Maximum available stock is ${product.stock}`);
        }
        cart.items[itemIdx].quantity = newQty;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      cart.updatedAt = new Date();
      return await dataStore.cart.getByUser(userId);
    },

    updateQuantity: async (userId: string, productId: string, quantity: number) => {
      const product = await dataStore.products.findById(productId);
      if (!product) throw new Error('Product not found');

      if (quantity > product.stock) {
        throw new Error(`Only ${product.stock} items in stock`);
      }

      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) throw new Error('Cart not found');

        if (quantity <= 0) {
          cart.items = cart.items.filter((i: any) => i.product.toString() !== productId.toString());
        } else {
          const item = cart.items.find((i: any) => i.product.toString() === productId.toString());
          if (item) item.quantity = quantity;
        }
        await cart.save();
        return await dataStore.cart.getByUser(userId);
      }

      const cart = memoryState.carts.find((c) => c.user === userId);
      if (!cart) throw new Error('Cart not found');

      if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i.product.toString() !== productId.toString());
      } else {
        const item = cart.items.find((i) => i.product.toString() === productId.toString());
        if (item) item.quantity = quantity;
      }
      cart.updatedAt = new Date();
      return await dataStore.cart.getByUser(userId);
    },

    removeItem: async (userId: string, productId: string) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        const cart = await CartModel.findOne({ user: userId });
        if (cart) {
          cart.items = cart.items.filter((i: any) => i.product.toString() !== productId.toString());
          await cart.save();
        }
        return await dataStore.cart.getByUser(userId);
      }

      const cart = memoryState.carts.find((c) => c.user === userId);
      if (cart) {
        cart.items = cart.items.filter((i) => i.product.toString() !== productId.toString());
        cart.updatedAt = new Date();
      }
      return await dataStore.cart.getByUser(userId);
    },

    clear: async (userId: string) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        await CartModel.findOneAndUpdate({ user: userId }, { items: [] });
        return { items: [], totalItems: 0, subtotal: 0, deliveryCharge: 0, totalAmount: 0 };
      }

      const cart = memoryState.carts.find((c) => c.user === userId);
      if (cart) {
        cart.items = [];
        cart.updatedAt = new Date();
      }
      return { items: [], totalItems: 0, subtotal: 0, deliveryCharge: 0, totalAmount: 0 };
    },
  },

  // Orders
  orders: {
    create: async (orderData: {
      userId?: string;
      customerDetails: { fullName: string; email: string; phone: string };
      deliveryAddress: { street: string; city: string; state: string; pincode: string };
      items: Array<{ product: string; quantity: number }>;
      notes?: string;
    }) => {
      // 1. Verify items & stock
      const detailedItems: any[] = [];
      let subtotal = 0;

      for (const item of orderData.items) {
        const product = await dataStore.products.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
        }

        detailedItems.push({
          product: product._id,
          name: product.name,
          price: product.finalPrice,
          quantity: item.quantity,
          image: product.image,
        });

        subtotal += product.finalPrice * item.quantity;
      }

      const deliveryCharge = subtotal > 150 ? 0 : 15;
      const totalAmount = subtotal + deliveryCharge;
      const orderId = 'BLN-' + Math.floor(100000 + Math.random() * 900000);

      let createdOrder: any = null;

      if (mongoose.connection.readyState === 1) {
        const orderDoc = await OrderModel.create({
          orderId,
          user: orderData.userId || null,
          customerDetails: orderData.customerDetails,
          deliveryAddress: orderData.deliveryAddress,
          items: detailedItems,
          totalAmount,
          deliveryCharge,
          paymentMethod: 'Cash on Delivery',
          orderStatus: 'Pending',
          notes: orderData.notes || '',
        });
        createdOrder = orderDoc.toObject();
      } else {
        createdOrder = {
          _id: 'ord_' + Math.random().toString(36).substring(2, 9),
          orderId,
          user: orderData.userId,
          customerDetails: orderData.customerDetails,
          deliveryAddress: orderData.deliveryAddress,
          items: detailedItems,
          totalAmount,
          deliveryCharge,
          paymentMethod: 'Cash on Delivery',
          orderStatus: 'Pending',
          notes: orderData.notes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryState.orders.unshift(createdOrder);
      }

      // 2. Reduce stock for all ordered products
      for (const item of orderData.items) {
        await dataStore.products.reduceStock(item.product, item.quantity);
      }

      // 3. Clear user's cart if authenticated
      if (orderData.userId) {
        await dataStore.cart.clear(orderData.userId);
      }

      return createdOrder;
    },

    getUserOrders: async (userId: string) => {
      if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
        return await OrderModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
      }
      return memoryState.orders
        .filter((o) => o.user === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    getOrderByIdOrCode: async (identifier: string) => {
      if (mongoose.connection.readyState === 1) {
        let order = null;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
          order = await OrderModel.findById(identifier).lean();
        }
        if (!order) {
          order = await OrderModel.findOne({ orderId: identifier }).lean();
        }
        return order;
      }
      return (
        memoryState.orders.find((o) => o._id === identifier || o.orderId === identifier) || null
      );
    },

    getAllOrdersForAdmin: async (statusFilter?: string) => {
      if (mongoose.connection.readyState === 1) {
        const query: any = {};
        if (statusFilter && statusFilter !== 'All') {
          query.orderStatus = statusFilter;
        }
        return await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      }

      let orders = [...memoryState.orders];
      if (statusFilter && statusFilter !== 'All') {
        orders = orders.filter((o) => o.orderStatus === statusFilter);
      }
      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    updateOrderStatus: async (orderId: string, newStatus: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled') => {
      if (mongoose.connection.readyState === 1) {
        let order = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
          order = await OrderModel.findByIdAndUpdate(
            orderId,
            { orderStatus: newStatus },
            { new: true }
          ).lean();
        }
        if (!order) {
          order = await OrderModel.findOneAndUpdate(
            { orderId },
            { orderStatus: newStatus },
            { new: true }
          ).lean();
        }
        return order;
      }

      const order = memoryState.orders.find((o) => o._id === orderId || o.orderId === orderId);
      if (!order) return null;
      order.orderStatus = newStatus;
      order.updatedAt = new Date();
      return order;
    },

    getAdminStats: async () => {
      let totalProducts = 0;
      let totalCustomers = 0;
      let totalOrders = 0;
      let pendingOrders = 0;
      let deliveredOrders = 0;
      let totalRevenue = 0;

      if (mongoose.connection.readyState === 1) {
        totalProducts = await ProductModel.countDocuments();
        totalCustomers = await UserModel.countDocuments({ role: 'user' });
        totalOrders = await OrderModel.countDocuments();
        pendingOrders = await OrderModel.countDocuments({ orderStatus: 'Pending' });
        deliveredOrders = await OrderModel.countDocuments({ orderStatus: 'Delivered' });

        const revenueAgg = await OrderModel.aggregate([
          { $match: { orderStatus: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        totalRevenue = revenueAgg[0]?.total || 0;
      } else {
        totalProducts = memoryState.products.length;
        totalCustomers = memoryState.users.filter((u) => u.role === 'user').length;
        totalOrders = memoryState.orders.length;
        pendingOrders = memoryState.orders.filter((o) => o.orderStatus === 'Pending').length;
        deliveredOrders = memoryState.orders.filter((o) => o.orderStatus === 'Delivered').length;
        totalRevenue = memoryState.orders
          .filter((o) => o.orderStatus !== 'Cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      }

      return {
        totalProducts,
        totalCustomers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      };
    },
  },
};
