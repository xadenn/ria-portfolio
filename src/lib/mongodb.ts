import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Normalizes a MongoDB URI:
 * 1. Removes outer whitespace
 * 2. Removes accidental angle brackets <password> -> password
 * 3. Ensures default database name is present (defaulting to "portfolio")
 */
export function normalizeMongoUri(raw?: string): string {
  if (!raw) return "";
  let uri = raw.trim();

  // Fix accidental angle brackets around user or password:
  // e.g. mongodb+srv://user:<password>@... or mongodb+srv://<user>:<password>@...
  uri = uri.replace(
    /(mongodb(?:\+srv)?:\/\/[^:]+:)<([^>]+)>(@.+)/,
    "$1$2$3"
  );
  uri = uri.replace(
    /(mongodb(?:\+srv)?:\/\/)(?:<([^>]+)>):([^@]+)(@.+)/,
    "$1$2:$3$4"
  );

  // If URI ends with .mongodb.net/ or .mongodb.net, add default database /portfolio
  if (/mongodb\.net\/?(\?.*)?$/.test(uri)) {
    uri = uri.replace(/mongodb\.net\/?(\?.*)?$/, (match, query) => {
      return `mongodb.net/portfolio${query || "?retryWrites=true&w=majority"}`;
    });
  }

  return uri;
}

export function getMongoUri(): string {
  return normalizeMongoUri(process.env.MONGODB_URI);
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = getMongoUri();
  if (!uri) {
    return null;
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      family: 4, // Force IPv4 to prevent IPv6 DNS delays on Windows/Node
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.warn("MongoDB connection failed, falling back to local store:", error);
    return null;
  }
}

export function isMongoConfigured(): boolean {
  const uri = getMongoUri();
  return Boolean(uri && uri.length > 0);
}

export async function verifyMongoHealth(): Promise<{
  connected: boolean;
  dbName?: string;
  host?: string;
  pingMs?: number;
  error?: string;
}> {
  const uri = getMongoUri();
  if (!uri) {
    return { connected: false, error: "MONGODB_URI is not defined." };
  }

  const start = Date.now();
  try {
    const conn = await connectToDatabase();
    if (!conn || !conn.connection.db) {
      return { connected: false, error: "Failed to establish active connection." };
    }

    await conn.connection.db.admin().ping();
    const pingMs = Date.now() - start;

    return {
      connected: true,
      dbName: conn.connection.name,
      host: conn.connection.host,
      pingMs,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { connected: false, error: msg };
  }
}

