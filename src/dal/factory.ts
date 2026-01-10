import MongoDAL from './mongoDal';
import { IDataAccess, Post, Comment } from './interfaces';

export function createPostsDAL(): IDataAccess<Post> {
  return new MongoDAL<Post>();
}

export function createCommentsDAL(): IDataAccess<Comment> {
  return new MongoDAL<Comment>();
}

export default {
  createPostsDAL,
  createCommentsDAL,
};
