import { MongoPostRepository, MongoCommentRepository, MongoUserRepository } from './mongoRepos';

export function getRepositories() {
  const repos: any = {
    postRepo: new MongoPostRepository(),
    commentRepo: new MongoCommentRepository(),
  };
  if (typeof (MongoUserRepository as any) === 'function') {
    repos.userRepo = new (MongoUserRepository as any)();
  }
  return repos;
}

export default getRepositories;
