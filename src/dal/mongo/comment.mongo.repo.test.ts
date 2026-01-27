import { CommentMongoRepository } from './comment.mongo.repo';
import CommentModel from './models/comment.model';
import { Comment } from '../models';

jest.mock('./models/comment.model');

const mockedCommentModel = CommentModel as jest.Mocked<typeof CommentModel>;

describe('CommentMongoRepository', () => {
  let repository: CommentMongoRepository;

  beforeEach(() => {
    repository = new CommentMongoRepository();
    jest.clearAllMocks();
  });

  const now = new Date();
  const commentDoc = {
    _id: '60d5ecb3b484352b8c8585e6',
    postId: 'post123',
    senderId: 'user123',
    content: 'This is a test comment.',
    createdAt: now,
    updatedAt: now,
  };

  const comment: Comment = {
    id: '60d5ecb3b484352b8c8585e6',
    postId: 'post123',
    senderId: 'user123',
    content: 'This is a test comment.',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  describe('create', () => {
    it('should create a new comment and return it', async () => {
      const newCommentData = {
        postId: 'post123',
        senderId: 'user123',
        content: 'This is a new comment.',
      };
      
      const createdDoc = { ...newCommentData, _id: 'newId', createdAt: now, updatedAt: now };
      const expectedComment = { ...newCommentData, id: 'newId', createdAt: now.toISOString(), updatedAt: now.toISOString() };

      (mockedCommentModel.create as jest.Mock).mockResolvedValue(createdDoc);

      const result = await repository.create(newCommentData);

      expect(mockedCommentModel.create).toHaveBeenCalledWith(newCommentData);
      expect(result).toEqual(expectedComment);
    });
  });

  describe('getById', () => {
    it('should return a comment by id', async () => {
        mockedCommentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(commentDoc),
      } as any);

      const result = await repository.getById(comment.id);

      expect(mockedCommentModel.findById).toHaveBeenCalledWith(comment.id);
      expect(result).toEqual(comment);
    });

    it('should return null if comment not found', async () => {
      mockedCommentModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await repository.getById('nonexistent');

      expect(mockedCommentModel.findById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getByPostId', () => {
    it('should return comments by postId', async () => {
      const docs = [commentDoc];
      mockedCommentModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(docs),
      } as any);

      const result = await repository.getByPostId('post123');

      expect(mockedCommentModel.find).toHaveBeenCalledWith({ postId: 'post123' });
      expect(result).toEqual([comment]);
    });
  });

  describe('update', () => {
    it('should update a comment and return it', async () => {
        const updateData = { content: 'Updated Content' };
        const updatedDoc = { ...commentDoc, ...updateData };
        
        mockedCommentModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedDoc),
        } as any);

      const result = await repository.update(comment.id, updateData);
      
      const expectedComment = { ...comment, ...updateData };

      expect(mockedCommentModel.findByIdAndUpdate).toHaveBeenCalledWith(comment.id, updateData, { new: true });
      expect(result).toEqual(expectedComment);
    });

    it('should return null if comment to update is not found', async () => {
        mockedCommentModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as any);

      const result = await repository.update('nonexistent', { content: 'Updated Content' });

      expect(mockedCommentModel.findByIdAndUpdate).toHaveBeenCalledWith('nonexistent', { content: 'Updated Content' }, { new: true });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a comment and return true', async () => {
        mockedCommentModel.findByIdAndDelete.mockReturnValue({
            exec: jest.fn().mockResolvedValue(commentDoc),
        } as any);

      const result = await repository.delete(comment.id);

      expect(mockedCommentModel.findByIdAndDelete).toHaveBeenCalledWith(comment.id);
      expect(result).toBe(true);
    });

    it('should return false if comment to delete is not found', async () => {
        mockedCommentModel.findByIdAndDelete.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as any);

      const result = await repository.delete('nonexistent');

      expect(mockedCommentModel.findByIdAndDelete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });
  });
});
