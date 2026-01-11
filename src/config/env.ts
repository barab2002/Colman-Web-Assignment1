import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  // Mongo connection URI and DB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/colman_db',
  MONGO_DB: process.env.MONGO_INITDB_DATABASE || process.env.MONGO_DB || 'colman_db',
  MONGO_USER: process.env.MONGO_INITDB_ROOT_USERNAME || process.env.MONGO_USER || '',
  MONGO_PASS: process.env.MONGO_INITDB_ROOT_PASSWORD || process.env.MONGO_PASS || '',
  // JWT settings
  JWT_SECRET: process.env.JWT_SECRET || 'BarAndIdanProjectSecret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
};
