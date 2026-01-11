import { PostMongoRepository } from './post.mongo.repo';
import PostModel from './models/post.model';
import { Post } from '../models';

jest.mock('./models/post.model');

const mockedPostModel = PostModel as jest.Mocked<typeof PostModel>;

describe('PostMongoRepository', () => {
  let repository: PostMongoRepository;

  beforeEach(() => {
    repository = new PostMongoRepository();
    jest.clearAllMocks();
  });

  const now = new Date();
  const postDoc = {
    _id: '60d5ecb3b484352b8c8585e5',
    senderId: 'user123',
    title: 'Test Post',
    content: 'This is a test post.',
    createdAt: now,
    updatedAt: now,
  };

  const post: Post = {
    id: '60d5ecb3b484352b8c8585e5',
    senderId: 'user123',
    title: 'Test Post',
    content: 'This is a test post.',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  describe('create', () => {
    it('should create a new post and return it', async () => {
      const newPostData = {
        senderId: 'user123',
        title: 'New Post',
        content: 'This is a new post.',
      };
      
      const createdDoc = { ...newPostData, _id: 'newId', createdAt: now, updatedAt: now };
      const expectedPost = { ...newPostData, id: 'newId', createdAt: now.toISOString(), updatedAt: now.toISOString() };

      (mockedPostModel.create as jest.Mock).mockResolvedValue(createdDoc);

      const result = await repository.create(newPostData);

      expect(mockedPostModel.create).toHaveBeenCalledWith(newPostData);
      expect(result).toEqual(expectedPost);
    });
  });

  describe('getAll', () => {
    it('should return all posts', async () => {
      const docs = [postDoc];
      mockedPostModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(docs),
      } as any);

      const result = await repository.getAll();

      expect(mockedPostModel.find).toHaveBeenCalled();
      expect(result).toEqual([post]);
    });
  });

  describe('getById', () => {
    it('should return a post by id', async () => {
        mockedPostModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(postDoc),
      } as any);

      const result = await repository.getById(post.id);

      expect(mockedPostModel.findById).toHaveBeenCalledWith(post.id);
      expect(result).toEqual(post);
    });

    it('should return null if post not found', async () => {
      mockedPostModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await repository.getById('nonexistent');

      expect(mockedPostModel.findById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('getBySender', () => {
    it('should return posts by senderId', async () => {
      const docs = [postDoc];
      mockedPostModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(docs),
      } as any);

      const result = await repository.getBySender('user123');

      expect(mockedPostModel.find).toHaveBeenCalledWith({ senderId: 'user123' });
      expect(result).toEqual([post]);
    });
  });

  describe('update', () => {
    it('should update a post and return it', async () => {
        const updateData = { title: 'Updated Title' };
        const updatedDoc = { ...postDoc, ...updateData };
        
        mockedPostModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedDoc),
        } as any);

      const result = await repository.update(post.id, updateData);
      
      const expectedPost = { ...post, ...updateData };

      expect(mockedPostModel.findByIdAndUpdate).toHaveBeenCalledWith(post.id, updateData, { new: true });
      expect(result).toEqual(expectedPost);
    });

    it('should return null if post to update is not found', async () => {
        mockedPostModel.findByIdAndUpdate.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        } as any);

      const result = await repository.update('nonexistent', { title: 'Updated Title' });

      expect(mockedPostModel.findByIdAndUpdate).toHaveBeenCalledWith('nonexistent', { title: 'Updated Title' }, { new: true });
      expect(result).toBeNull();
    });
  });
});
