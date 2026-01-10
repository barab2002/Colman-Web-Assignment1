import { CommentRepository } from '../interfaces';
import CommentModel from './models/comment.model';
import { Comment } from '../models';

function toComment(doc: any): Comment {
  return {
    id: String(doc._id),
    postId: doc.postId,
    senderId: doc.senderId,
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class CommentMongoRepository implements CommentRepository {
  constructor() {}

  async create(comment: any): Promise<Comment> {
    const created = await CommentModel.create({
      postId: comment.postId,
      senderId: comment.senderId,
      content: comment.content,
    });
    return toComment(created);
  }

  async getById(id: string): Promise<Comment | null> {
    const doc = await CommentModel.findById(id).exec();
    return doc ? toComment(doc) : null;
  }

  async getByPostId(postId: string): Promise<Comment[]> {
    const docs = await CommentModel.find({ postId }).sort({ createdAt: -1 }).exec();
    return docs.map(toComment);
  }

  async update(id: string, data: any): Promise<Comment | null> {
    const doc = await CommentModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return doc ? toComment(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await CommentModel.findByIdAndDelete(id).exec();
    return res != null;
  }
}
