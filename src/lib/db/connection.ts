import mongoose from "mongoose";

export type MongooseInstance = typeof mongoose;

export const MONGO_STATES = {
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
} as const;

type ConnectionCache = {
  uri: string | null;
  conn: MongooseInstance | null;
  promise: Promise<MongooseInstance> | null;
};

const globalCache = globalThis as typeof globalThis & {
  __geosatMongoose?: ConnectionCache;
};

const cache: ConnectionCache = (globalCache.__geosatMongoose ??= {
  uri: null,
  conn: null,
  promise: null,
});

export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example) before connecting.",
    );
  }

  return uri;
}

export async function connectDB(
  uri: string = getMongoUri(),
): Promise<MongooseInstance> {
  if (
    cache.conn &&
    cache.uri === uri &&
    cache.conn.connection.readyState === MONGO_STATES.connected
  ) {
    return cache.conn;
  }

  if (cache.promise && cache.uri === uri) {
    return cache.promise;
  }

  if (cache.conn && cache.uri !== uri) {
    await disconnectDB();
  }

  cache.uri = uri;
  cache.promise = mongoose
    .connect(uri, {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    })
    .catch((error) => {
      cache.promise = null;
      cache.conn = null;
      throw error;
    });

  cache.conn = await cache.promise;

  return cache.conn;
}

export async function disconnectDB(): Promise<void> {
  const pending = cache.promise;

  cache.uri = null;
  cache.promise = null;

  if (cache.conn) {
    const conn = cache.conn;
    cache.conn = null;
    await conn.disconnect();
    return;
  }

  if (pending) {
    await pending.catch(() => undefined);
  }
}

export function getConnectionState(): number {
  return cache.conn?.connection.readyState ?? MONGO_STATES.disconnected;
}

export function getDatabaseName(): string | null {
  return cache.conn?.connection.name ?? null;
}

export default connectDB;
