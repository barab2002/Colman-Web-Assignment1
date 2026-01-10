import mongoose, { Schema, Document } from 'mongoose';

export interface PostDoc extends Document {
  senderId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<PostDoc> = new Schema(
  {
    senderId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const PostModel = mongoose.models.Post || mongoose.model<PostDoc>('Post', PostSchema);
export default PostModel;
