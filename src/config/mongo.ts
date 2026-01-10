import mongoose from 'mongoose';
import { config } from './env';

export async function connectMongo(): Promise<typeof mongoose> {
  let uri = process.env.MONGO_URI || config.MONGO_URI || 'mongodb://localhost:27017/colman_db';

  const user = process.env.MONGO_INITDB_ROOT_USERNAME || config.MONGO_USER;
  const pass = process.env.MONGO_INITDB_ROOT_PASSWORD || config.MONGO_PASS;

  if (user && pass) {
    try {
      const stripped = uri.replace(/^mongodb:\/\//, '');
      const parts = stripped.split('/');
      const hostPart = parts[0] || 'localhost:27017';
      const db = config.MONGO_DB || parts[1] || 'colman_db';
      uri = `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostPart}/${db}?authSource=admin`;
    } catch (e) {
      // fall back to provided URI
    }
  }

  const opts = {
    autoIndex: true,
  };

  return mongoose.connect(uri, opts as any);
}

export default connectMongo;
