import mongoose from 'mongoose';
import { initializeDataStore } from '../data/store.ts';

export interface DbStatus {
  connected: boolean;
  mode: 'mongodb_atlas' | 'fallback_memory';
  uriConfigured: boolean;
  message: string;
  clusterHost?: string;
  whitelistNotice?: boolean;
}

let isConnected = false;
let connectionMode: 'mongodb_atlas' | 'fallback_memory' = 'fallback_memory';
let lastMessage = 'Database initializing...';
let isConnecting = false;

function normalizeMongoUri(rawUri: string): string {
  const uri = rawUri.trim().replace(/^["']|["']$/g, '');
  if (uri.includes('.mongodb.net/?')) {
    return uri.replace('.mongodb.net/?', '.mongodb.net/balan_ecommerce?');
  }
  if (uri.endsWith('.mongodb.net') || uri.endsWith('.mongodb.net/')) {
    return uri.replace(/\.mongodb\.net\/?$/, '.mongodb.net/balan_ecommerce?retryWrites=true&w=majority');
  }
  return uri;
}

export const connectDB = async (): Promise<DbStatus> => {
  const rawUri = process.env.MONGODB_URI;

  if (!rawUri || rawUri.trim() === '' || rawUri.includes('YOUR_MONGODB_URI')) {
    connectionMode = 'fallback_memory';
    isConnected = false;
    lastMessage = 'No MONGODB_URI configured. Running in resilient local storage mode.';
    return getDbStatus();
  }

  const mongoUri = normalizeMongoUri(rawUri);

  if (isConnecting) {
    return getDbStatus();
  }

  isConnecting = true;

  try {
    console.log('[Balan Database] Initiating connection probe to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    connectionMode = 'mongodb_atlas';
    lastMessage = `Connected to MongoDB Atlas host: ${conn.connection.host}`;
    console.log(`[Balan Database] Connected to MongoDB Atlas host: ${conn.connection.host}`);
    
    // Seed MongoDB collections if empty
    await initializeDataStore();
  } catch (error: any) {
    isConnected = false;
    connectionMode = 'fallback_memory';
    const isWhitelistError =
      error.message?.includes('whitelist') ||
      error.message?.includes('Could not connect to any servers') ||
      error.message?.includes('ETIMEDOUT') ||
      error.message?.includes('ENOTFOUND');

    if (isWhitelistError) {
      lastMessage =
        'MongoDB Atlas connection pending IP whitelist. In MongoDB Atlas, go to Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0). Store is operating in resilient local storage mode.';
      console.log(
        '[Balan Database] Atlas connection pending IP access (0.0.0.0/0). Resilient storage active.'
      );
    } else {
      lastMessage = `Atlas connection attempt paused: ${error.message}. Store is operating in resilient local storage mode.`;
      console.log(`[Balan Database] Running in resilient storage mode: ${error.message}`);
    }
  } finally {
    isConnecting = false;
  }

  return getDbStatus();
};

export const getDbStatus = (): DbStatus => {
  const rawUri = process.env.MONGODB_URI;
  const uriConfigured = !!(rawUri && !rawUri.includes('YOUR_MONGODB_URI'));
  let clusterHost = '';
  if (rawUri && rawUri.includes('@')) {
    const match = rawUri.match(/@([^/?]+)/);
    if (match) clusterHost = match[1];
  }

  return {
    connected: isConnected,
    mode: connectionMode,
    uriConfigured,
    message: lastMessage,
    clusterHost: clusterHost || undefined,
    whitelistNotice: uriConfigured && !isConnected,
  };
};
