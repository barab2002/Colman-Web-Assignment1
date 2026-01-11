import { UserRepository } from '../interfaces';
import UserModel from './models/user.model';

export class UserMongoRepository implements UserRepository {
  constructor() {}

  async create(user: any): Promise<any> {
    const created = await UserModel.create({
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      refreshTokens: user.refreshTokens || [],
    });
    return {
      id: String(created._id),
      username: created.username,
      email: created.email,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async getAll(): Promise<any[]> {
    const docs = await UserModel.find().sort({ createdAt: -1 }).exec();
    return docs.map((d: any) => ({ id: String(d._id), username: d.username, email: d.email, createdAt: d.createdAt.toISOString(), updatedAt: d.updatedAt.toISOString() }));
  }

  async getById(id: string): Promise<any | null> {
    const doc = await UserModel.findById(id).exec();
    if (!doc) return null;
    return { id: String(doc._id), username: doc.username, email: doc.email, createdAt: doc.createdAt.toISOString(), updatedAt: doc.updatedAt.toISOString() };
  }

  async getByUsername(username: string): Promise<any | null> {
    const doc = await UserModel.findOne({ username }).exec();
    if (!doc) return null;
    return { id: String(doc._id), username: doc.username, email: doc.email, passwordHash: doc.passwordHash, refreshTokens: doc.refreshTokens };
  }

  async getByEmail(email: string): Promise<any | null> {
    const doc = await UserModel.findOne({ email }).exec();
    if (!doc) return null;
    return { id: String(doc._id), username: doc.username, email: doc.email, passwordHash: doc.passwordHash, refreshTokens: doc.refreshTokens };
  }

  async update(id: string, data: Partial<any>): Promise<any | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!doc) return null;
    return { id: String(doc._id), username: doc.username, email: doc.email, createdAt: doc.createdAt.toISOString(), updatedAt: doc.updatedAt.toISOString() };
  }

  async delete(id: string): Promise<boolean> {
    const res = await UserModel.findByIdAndDelete(id).exec();
    return res != null;
  }
}
