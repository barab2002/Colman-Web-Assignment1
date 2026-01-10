import JsonBase from './jsonBase';
import path from 'path';
import { Comment } from './models';
import { CommentRepository } from './interfaces';
import { config } from '../config/env';

export default class CommentRepositoryJson extends JsonBase<Comment> implements CommentRepository {
  constructor() {
    const base = config.DATA_DIR || path.join(process.cwd(), 'data');
    const file = path.isAbsolute(base) ? path.join(base, 'comments.json') : path.join(process.cwd(), base, 'comments.json');
    super(file);
  }

  async create(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Comment, 'id'>>): Promise<Comment> {
    const items = await this.readAll();
    const id = (comment as any).id ?? this.genId();
    const now = new Date().toISOString();
    const newComment: Comment = { ...(comment as any), id, createdAt: now, updatedAt: now };
    items.push(newComment);
    await this.writeAll(items);
    return newComment;
  }

  async getById(id: string): Promise<Comment | null> {
    const items = await this.readAll();
    return items.find((c) => c.id === id) ?? null;
  }

  async getByPostId(postId: string): Promise<Comment[]> {
    const items = await this.readAll();
    return items.filter((c) => c.postId === postId);
  }

  async update(id: string, data: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<Comment | null> {
    const items = await this.readAll();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updatedAt = new Date().toISOString();
    items[idx] = { ...items[idx], ...(data as any), updatedAt } as Comment;
    await this.writeAll(items);
    return items[idx];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readAll();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this.writeAll(items);
    return true;
  }
}
