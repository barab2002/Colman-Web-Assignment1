import { Request, Response } from 'express';
import * as postService from '../services/post.service';
import { createPost, getPosts, getPost, updatePost } from './post.controller';
import { Post } from '../dal/models';

jest.mock('../services/post.service');

const mockedPostService = postService as jest.Mocked<typeof postService>;

describe('Post Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  const now = new Date();
  const samplePost: Post = {
    id: 'p1',
    senderId: 'u1',
    title: 't1',
    content: 'c1',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post and return 201', async () => {
      (req as any).user = { id: 'u1' };
      req.body = { title: 't1', content: 'c1' };
      const newPost = { ...samplePost, senderId: 'u1', ...req.body };
      mockedPostService.createPost.mockResolvedValue(newPost);

      await createPost(req as Request, res as Response);

      expect(mockedPostService.createPost).toHaveBeenCalledWith({ senderId: 'u1', title: 't1', content: 'c1' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newPost);
    });

    it('should return 400 if required fields are missing', async () => {
      (req as any).user = { id: 'u1' };
      req.body = {}; // Missing title and content
      await createPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'senderId, title and content are required' });
    });
  });

  describe('getPosts', () => {
    it('should return all posts if no sender is specified', async () => {
      const posts = [samplePost];
      mockedPostService.getAllPosts.mockResolvedValue(posts);

      await getPosts(req as Request, res as Response);

      expect(mockedPostService.getAllPosts).toHaveBeenCalledWith(undefined);
      expect(res.json).toHaveBeenCalledWith(posts);
    });

    it('should return posts by sender if sender is specified', async () => {
      req.query = { sender: 'u1' };
      const posts = [samplePost];
      mockedPostService.getAllPosts.mockResolvedValue(posts);

      await getPosts(req as Request, res as Response);

      expect(mockedPostService.getAllPosts).toHaveBeenCalledWith('u1');
      expect(res.json).toHaveBeenCalledWith(posts);
    });
  });

  describe('getPost', () => {
    it('should return a post by id and 200', async () => {
      req.params = { postId: 'p1' };
      mockedPostService.getPostById.mockResolvedValue(samplePost);

      await getPost(req as Request, res as Response);

      expect(mockedPostService.getPostById).toHaveBeenCalledWith('p1');
      expect(res.json).toHaveBeenCalledWith(samplePost);
    });

    it('should return 404 if post not found', async () => {
      req.params = { postId: 'nonexistent' };
      mockedPostService.getPostById.mockResolvedValue(null);

      await getPost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('updatePost', () => {
    it('should update a post and return 200', async () => {
      req.params = { postId: 'p1' };
      req.body = { title: 'updated title' };
      const updatedPost = { ...samplePost, ...req.body };
      mockedPostService.updatePost.mockResolvedValue(updatedPost);

      await updatePost(req as Request, res as Response);

      expect(mockedPostService.updatePost).toHaveBeenCalledWith('p1', req.body);
      expect(res.json).toHaveBeenCalledWith(updatedPost);
    });

    it('should return 404 if post to update is not found', async () => {
      req.params = { postId: 'nonexistent' };
      req.body = { title: 'updated title' };
      mockedPostService.updatePost.mockResolvedValue(null);

      await updatePost(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});