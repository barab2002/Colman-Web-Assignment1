import mongoose, { Schema, Document } from 'mongoose';

export interface CommentDoc extends Document {
  postId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema<CommentDoc> = new Schema(
  {
    postId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentModel = mongoose.models.Comment || mongoose.model<CommentDoc>('Comment', CommentSchema);
export default CommentModel;
