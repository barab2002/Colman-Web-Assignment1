import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  // DB_TYPE: 'JSON' | 'MONGO' (case-insensitive). Defaults to JSON
  DB_TYPE: (process.env.DB_TYPE || 'JSON').toUpperCase(),
  // Directory where JSON files are stored (relative to project root or absolute)
  DATA_DIR: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
};
