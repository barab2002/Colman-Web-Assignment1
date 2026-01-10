// Comment JSON repository removed — use Mongo repositories instead.
import { Comment } from './models';
import { CommentRepository } from './interfaces';

export default class CommentRepositoryJson implements CommentRepository {
  constructor(..._args: any[]) { throw new Error('CommentRepositoryJson removed. Use CommentMongoRepository instead.'); }
  async create(_comment: any): Promise<Comment> { throw new Error('CommentRepositoryJson removed'); }
  async getById(_id: string): Promise<Comment | null> { throw new Error('CommentRepositoryJson removed'); }
  async getByPostId(_postId: string): Promise<Comment[]> { throw new Error('CommentRepositoryJson removed'); }
  async update(_id: string, _data: any): Promise<Comment | null> { throw new Error('CommentRepositoryJson removed'); }
  async delete(_id: string): Promise<boolean> { throw new Error('CommentRepositoryJson removed'); }
}
