import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Basic robust JSON-file storage helper for arrays of objects
export default class JsonBase<T extends { id: string }>{
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

  protected async readAll(): Promise<T[]> {
    await this.ensureFile();
    const raw = await fs.readFile(this.filePath, 'utf8');
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed as T[] : [];
    } catch {
      // avoid throwing on parse errors; return empty array for robustness
      return [];
    }
  }

  protected async writeAll(items: T[]): Promise<void> {
    const tmp = `${this.filePath}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(items, null, 2), 'utf8');
    await fs.rename(tmp, this.filePath);
  }

  protected genId(): string {
    // Use stable UUID v4 via Node's crypto
    return randomUUID();
  }
}
