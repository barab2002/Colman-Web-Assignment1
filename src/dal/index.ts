import { MongoPostRepository, MongoCommentRepository } from './mongoRepos';

export function getRepositories() {
  return {
    postRepo: new MongoPostRepository(),
    commentRepo: new MongoCommentRepository(),
  };
}

export default getRepositories;
