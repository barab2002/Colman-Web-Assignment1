// Json file DAL removed — use MongoDAL instead.
import { IDataAccess } from './interfaces';

export default class JsonFileDAL<T extends { id: string }> implements IDataAccess<T> {
  constructor(..._args: any[]) {
    throw new Error('JsonFileDAL removed. Use MongoDAL instead.');
  }
  async getAll(): Promise<T[]> { throw new Error('JsonFileDAL removed'); }
  async getById(_id: string): Promise<T | null> { throw new Error('JsonFileDAL removed'); }
  async create(_item: Partial<T> & { id?: string }): Promise<T> { throw new Error('JsonFileDAL removed'); }
  async update(_id: string, _item: Partial<T>): Promise<T | null> { throw new Error('JsonFileDAL removed'); }
  async delete(_id: string): Promise<boolean> { throw new Error('JsonFileDAL removed'); }
}
