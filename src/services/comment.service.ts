import getRepositories from '../dal/index';
import { Comment } from '../dal/models';

const { commentRepo } = getRepositories();

export async function createComment(data: Partial<Comment>): Promise<Comment> {
  return commentRepo.create(data as any);
}

export async function getCommentById(id: string): Promise<Comment | null> {
  return commentRepo.getById(id);
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  return commentRepo.getByPostId(postId);
}

export async function updateComment(id: string, data: Partial<Comment>): Promise<Comment | null> {
  return commentRepo.update(id, data as any);
}

export async function deleteComment(id: string): Promise<boolean> {
  return commentRepo.delete(id);
}
