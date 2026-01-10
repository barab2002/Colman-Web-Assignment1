import PostRepositoryJson from './postRepositoryJson';
import CommentRepositoryJson from './commentRepositoryJson';
import { MongoPostRepository, MongoCommentRepository } from './mongoRepos';
import { config } from '../config/env';

export function getRepositories() {
  // Support either DATA_STORE or DB_TYPE env vars
  const store = (process.env.DATA_STORE || config.DB_TYPE || 'JSON').toUpperCase();
  if (store === 'MONGO') {
    return {
      postRepo: new MongoPostRepository(),
      commentRepo: new MongoCommentRepository(),
    };
  }

  // default to JSON
  return {
    postRepo: new PostRepositoryJson(),
    commentRepo: new CommentRepositoryJson(),
  };
}

export default getRepositories;
