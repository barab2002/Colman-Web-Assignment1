import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  // DB_TYPE: 'JSON' | 'MONGO' (case-insensitive). Defaults to JSON
  DB_TYPE: (process.env.DB_TYPE || process.env.DATA_STORE || 'JSON').toUpperCase(),
  // Directory where JSON files are stored (relative to project root or absolute)
  DATA_DIR: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
  // Mongo connection URI and DB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/colman_db',
  MONGO_DB: process.env.MONGO_INITDB_DATABASE || process.env.MONGO_DB || 'colman_db',
  MONGO_USER: process.env.MONGO_INITDB_ROOT_USERNAME || process.env.MONGO_USER || '',
  MONGO_PASS: process.env.MONGO_INITDB_ROOT_PASSWORD || process.env.MONGO_PASS || '',
};
