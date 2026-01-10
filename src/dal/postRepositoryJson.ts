// Post JSON repository removed — use Mongo repositories instead.
import { Post } from './models';
import { PostRepository } from './interfaces';

export default class PostRepositoryJson implements PostRepository {
  constructor(..._args: any[]) { throw new Error('PostRepositoryJson removed. Use MongoPostRepository instead.'); }
  async create(_post: any): Promise<Post> { throw new Error('PostRepositoryJson removed'); }
  async getAll(): Promise<Post[]> { throw new Error('PostRepositoryJson removed'); }
  async getById(_id: string): Promise<Post | null> { throw new Error('PostRepositoryJson removed'); }
  async getBySender(_senderId: string): Promise<Post[]> { throw new Error('PostRepositoryJson removed'); }
  async update(_id: string, _data: any): Promise<Post | null> { throw new Error('PostRepositoryJson removed'); }
}
