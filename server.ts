import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure environment variables are loaded from .env or .env.example
if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else if (fs.existsSync('.env.example')) {
  dotenv.config({ path: '.env.example' });
}

import express from 'express';
import cors from 'cors';
import { connectDB, getDbStatus } from './server/config/db.ts';
import { initializeDataStore } from './server/data/store.ts';
import authRoutes from './server/routes/authRoutes.ts';
import productRoutes from './server/routes/productRoutes.ts';
import cartRoutes from './server/routes/cartRoutes.ts';
import orderRoutes from './server/routes/orderRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isRender = process.env.RENDER === 'true';
const isProduction = process.env.NODE_ENV === 'production' || isRender;

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize in-memory seed data first so app is immediately responsive
  await initializeDataStore();

  // Attempt database connection probe asynchronously
  connectDB().catch(() => {});

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);

  // System & Health Status
  app.get('/api/system/status', (_req, res) => {
    const dbStatus = getDbStatus();
    res.json({
      success: true,
      service: 'BALAN E-COMMERCE API',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: isProduction ? 'production' : 'development',
    });
  });

  // Reconnection trigger for MongoDB Atlas
  app.post('/api/system/reconnect-db', async (_req, res) => {
    const status = await connectDB();
    res.json({
      success: true,
      database: status,
    });
  });

  // Global Error Handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error occurred.',
    });
  });

  // Static Assets (makes generated product photos always accessible in both dev and production)
  const srcAssetsPath = path.resolve(__dirname, 'src', 'assets');
  if (fs.existsSync(srcAssetsPath)) {
    app.use('/src/assets', express.static(srcAssetsPath));
  }

  // Frontend Serving (Dev vs Production)
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Balan Server] Development mode active with Vite middleware.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const indexHtmlPath = path.resolve(distPath, 'index.html');

    // If on Render or production but dist/ hasn't been built yet, build it automatically
    if (!fs.existsSync(indexHtmlPath)) {
      console.log('📦 [Balan Server] Building client bundle for production...');
      try {
        const { build } = await import('vite');
        await build();
        console.log('✅ [Balan Server] Client bundle built successfully.');
      } catch (buildErr: any) {
        console.error('⚠️ [Balan Server] Client build error:', buildErr.message);
      }
    }

    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexHtmlPath);
    });
    console.log('📦 [Balan Server] Production mode active: serving static client from dist/');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Balan E-Commerce] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
