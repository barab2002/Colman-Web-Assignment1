import mongoose, { Schema, Document } from 'mongoose';

export interface UserDoc extends Document {
  username: string;
  email: string;
  passwordHash: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<UserDoc> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    refreshTokens: { type: [String], default: [] },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model<UserDoc>('User', UserSchema);
export default UserModel;
