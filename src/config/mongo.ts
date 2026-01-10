import mongoose from 'mongoose';
import { config } from './env';

export async function connectMongo(): Promise<typeof mongoose> {
  const uri = process.env.MONGO_URI || config.MONGO_URI || 'mongodb://localhost:27017/colman_assignment1';
  const opts = {
    // options placeholder
  };
  return mongoose.connect(uri, opts as any);
}

export default connectMongo;
