import { PostRepository } from '../interfaces';
import PostModel from './models/post.model';
import { Post } from '../models';

function toPost(doc: any): Post {
  return {
    id: String(doc._id),
    senderId: doc.senderId,
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class PostMongoRepository implements PostRepository {
  constructor() {}

  async create(post: any): Promise<Post> {
    const created = await PostModel.create({
      senderId: post.senderId,
      title: post.title,
      content: post.content,
    });
    return toPost(created);
  }

  async getAll(): Promise<Post[]> {
    const docs = await PostModel.find().sort({ createdAt: -1 }).exec();
    return docs.map(toPost);
  }

  async getById(id: string): Promise<Post | null> {
    const doc = await PostModel.findById(id).exec();
    return doc ? toPost(doc) : null;
  }

  async getBySender(senderId: string): Promise<Post[]> {
    const docs = await PostModel.find({ senderId }).sort({ createdAt: -1 }).exec();
    return docs.map(toPost);
  }

  async update(id: string, data: any): Promise<Post | null> {
    const doc = await PostModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return doc ? toPost(doc) : null;
  }
}
