import { promises as fs } from 'fs';
import path from 'path';
import { IDataAccess } from './interfaces';

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export default class JsonFileDAL<T extends { id: string }> implements IDataAccess<T> {
  constructor(private filePath: string) {}

  private async ensureFile(): Promise<void> {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '[]', 'utf8');
    }
  }

  private async readAll(): Promise<T[]> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf8');
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as T[] : [];
    } catch {
      // If file corrupted, return empty list to avoid throwing from read
      return [];
    }
  }

  private async writeAll(items: T[]): Promise<void> {
    const tmp = `${this.filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(items, null, 2), 'utf8');
    await fs.rename(tmp, this.filePath);
  }

  async getAll(): Promise<T[]> {
    return this.readAll();
  }

  async getById(id: string): Promise<T | null> {
    const items = await this.readAll();
    return items.find((it) => it.id === id) ?? null;
  }

  async create(item: Partial<T> & { id?: string }): Promise<T> {
    const items = await this.readAll();
    const id = item.id ?? generateId();
    const now = new Date().toISOString();
    const newItem = { ...(item as any), id, createdAt: (item as any).createdAt ?? now } as T;
    items.push(newItem);
    await this.writeAll(items);
    return newItem;
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    const items = await this.readAll();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...(item as any) } as T;
    await this.writeAll(items);
    return items[idx];
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readAll();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this.writeAll(items);
    return true;
  }
}
