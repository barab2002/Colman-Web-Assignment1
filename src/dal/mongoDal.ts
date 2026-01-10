import { IDataAccess } from './interfaces';

// Minimal Mongo placeholder to allow compile-time usage. Real implementation
// can be swapped in later. Methods return rejected promises to indicate not
// implemented at runtime.
export default class MongoDAL<T extends { id: string }> implements IDataAccess<T> {
  constructor(..._args: any[]) {
    // placeholder ctor
  }

  async getAll(): Promise<T[]> {
    return Promise.reject(new Error('MongoDAL not implemented'));
  }
  async getById(_id: string): Promise<T | null> {
    return Promise.reject(new Error('MongoDAL not implemented'));
  }
  async create(_item: Partial<T> & { id?: string }): Promise<T> {
    return Promise.reject(new Error('MongoDAL not implemented'));
  }
  async update(_id: string, _item: Partial<T>): Promise<T | null> {
    return Promise.reject(new Error('MongoDAL not implemented'));
  }
  async delete(_id: string): Promise<boolean> {
    return Promise.reject(new Error('MongoDAL not implemented'));
  }
}
