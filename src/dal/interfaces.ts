export interface IDataAccess<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Partial<T> & { id?: string }): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
import { Post, Comment } from './models';

export interface PostRepository {
  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Post, 'id'>>): Promise<Post>;
  getAll(): Promise<Post[]>;
  getById(id: string): Promise<Post | null>;
  getBySender(senderId: string): Promise<Post[]>;
  update(id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null>;
}

export interface CommentRepository {
  create(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Comment, 'id'>>): Promise<Comment>;
  getById(id: string): Promise<Comment | null>;
  getByPostId(postId: string): Promise<Comment[]>;
  update(id: string, data: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<Comment | null>;
  delete(id: string): Promise<boolean>;
}
export { Post, Comment };

