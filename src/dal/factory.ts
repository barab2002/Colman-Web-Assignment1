import path from 'path';
import JsonFileDAL from './jsonFileDal';
import MongoDAL from './mongoDal';
import { IDataAccess, Post, Comment } from './interfaces';
import { config } from '../config/env';

function resolveDataPath(filename: string) {
  const base = config.DATA_DIR || path.join(process.cwd(), 'data');
  return path.isAbsolute(base) ? path.join(base, filename) : path.join(process.cwd(), base, filename);
}

export function createPostsDAL(): IDataAccess<Post> {
  if ((config.DB_TYPE || 'JSON') === 'MONGO') {
    return new MongoDAL<Post>();
  }
  const file = resolveDataPath('posts.json');
  return new JsonFileDAL<Post>(file);
}

export function createCommentsDAL(): IDataAccess<Comment> {
  if ((config.DB_TYPE || 'JSON') === 'MONGO') {
    return new MongoDAL<Comment>();
  }
  const file = resolveDataPath('comments.json');
  return new JsonFileDAL<Comment>(file);
}

export default {
  createPostsDAL,
  createCommentsDAL,
};
