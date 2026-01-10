import getRepositories from '../dal/index';
import { Post } from '../dal/models';

const { postRepo } = getRepositories();

export async function createPost(data: Partial<Post>): Promise<Post> {
  return postRepo.create(data as any);
}

export async function getAllPosts(senderId?: string): Promise<Post[]> {
  if (senderId) return (postRepo as any).getBySender(senderId);
  return postRepo.getAll();
}

export async function getPostById(id: string): Promise<Post | null> {
  return postRepo.getById(id);
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  return postRepo.update(id, data as any);
}
