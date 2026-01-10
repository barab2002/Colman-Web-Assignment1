import JsonBase from './jsonBase';
import path from 'path';
import { Post } from './models';
import { PostRepository } from './interfaces';
import { config } from '../config/env';

export default class PostRepositoryJson extends JsonBase<Post> implements PostRepository {
  constructor() {
    const base = config.DATA_DIR || path.join(process.cwd(), 'data');
    const file = path.isAbsolute(base) ? path.join(base, 'posts.json') : path.join(process.cwd(), base, 'posts.json');
    super(file);
  }

  async create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Post, 'id'>>): Promise<Post> {
    const items = await this.readAll();
    const id = (post as any).id ?? this.genId();
    const now = new Date().toISOString();
    const newPost: Post = { ...(post as any), id, createdAt: now, updatedAt: now };
    items.push(newPost);
    await this.writeAll(items);
    return newPost;
  }

  async getAll(): Promise<Post[]> {
    return this.readAll();
  }

  async getById(id: string): Promise<Post | null> {
    const items = await this.readAll();
    return items.find((p) => p.id === id) ?? null;
  }

  async getBySender(senderId: string): Promise<Post[]> {
    const items = await this.readAll();
    return items.filter((p) => p.senderId === senderId);
  }

  async update(id: string, data: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> {
    const items = await this.readAll();
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updatedAt = new Date().toISOString();
    items[idx] = { ...items[idx], ...(data as any), updatedAt } as Post;
    await this.writeAll(items);
    return items[idx];
  }
}
