import { PostRepository, CommentRepository } from './interfaces';
import { Post, Comment } from './models';

// Placeholders for Mongo-based repositories. They compile but throw at runtime.
export class MongoPostRepository implements PostRepository {
  constructor(..._args: any[]) {}
  async create(_post: any): Promise<Post> { throw new Error('Mongo DAL not implemented'); }
  async getAll(): Promise<Post[]> { throw new Error('Mongo DAL not implemented'); }
  async getById(_id: string): Promise<Post | null> { throw new Error('Mongo DAL not implemented'); }
  async getBySender(_senderId: string): Promise<Post[]> { throw new Error('Mongo DAL not implemented'); }
  async update(_id: string, _data: any): Promise<Post | null> { throw new Error('Mongo DAL not implemented'); }
}

export class MongoCommentRepository implements CommentRepository {
  constructor(..._args: any[]) {}
  async create(_comment: any): Promise<Comment> { throw new Error('Mongo DAL not implemented'); }
  async getById(_id: string): Promise<Comment | null> { throw new Error('Mongo DAL not implemented'); }
  async getByPostId(_postId: string): Promise<Comment[]> { throw new Error('Mongo DAL not implemented'); }
  async update(_id: string, _data: any): Promise<Comment | null> { throw new Error('Mongo DAL not implemented'); }
  async delete(_id: string): Promise<boolean> { throw new Error('Mongo DAL not implemented'); }
}
