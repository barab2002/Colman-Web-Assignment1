import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';
import { createComment, getComment, updateComment, deleteComment, getCommentsByPost } from './comment.controller';
import { Comment } from '../dal/models';

jest.mock('../services/comment.service');

const mockedCommentService = commentService as jest.Mocked<typeof commentService>;

describe('Comment Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  const now = new Date();
  const sampleComment: Comment = {
    id: 'c1',
    postId: 'p1',
    senderId: 'u1',
    content: 'A sample comment',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a comment and return 201', async () => {
      (req as any).user = { id: 'u1' };
      req.body = { postId: 'p1', content: 'A sample comment' };
      const newComment = { ...sampleComment, senderId: 'u1', ...req.body };
      mockedCommentService.createComment.mockResolvedValue(newComment);

      await createComment(req as Request, res as Response);

      expect(mockedCommentService.createComment).toHaveBeenCalledWith({ postId: 'p1', senderId: 'u1', content: 'A sample comment' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newComment);
    });

    it('should return 400 if required fields are missing', async () => {
      (req as any).user = { id: 'u1' };
      req.body = { postId: 'p1' }; // Missing content
      await createComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'postId, senderId and content are required' });
    });
  });

  describe('getComment', () => {
    it('should return a comment and 200', async () => {
      req.params = { commentId: 'c1' };
      mockedCommentService.getCommentById.mockResolvedValue(sampleComment);

      await getComment(req as Request, res as Response);

      expect(mockedCommentService.getCommentById).toHaveBeenCalledWith('c1');
      expect(res.json).toHaveBeenCalledWith(sampleComment);
    });

    it('should return 404 if comment not found', async () => {
      req.params = { commentId: 'nonexistent' };
      mockedCommentService.getCommentById.mockResolvedValue(null);

      await getComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('updateComment', () => {
    it('should update a comment and return 200', async () => {
      req.params = { commentId: 'c1' };
      (req as any).user = { id: 'u1' };
      req.body = { content: 'updated content' };
      const updatedComment = { ...sampleComment, ...req.body };
      mockedCommentService.getCommentById.mockResolvedValue(sampleComment);
      mockedCommentService.updateComment.mockResolvedValue(updatedComment);

      await updateComment(req as Request, res as Response);

      expect(mockedCommentService.getCommentById).toHaveBeenCalledWith('c1');
      expect(mockedCommentService.updateComment).toHaveBeenCalledWith('c1', req.body);
      expect(res.json).toHaveBeenCalledWith(updatedComment);
    });

    it('should return 404 if comment to update is not found', async () => {
      req.params = { commentId: 'nonexistent' };
      req.body = { content: 'updated content' };
      mockedCommentService.getCommentById.mockResolvedValue(null);

      await updateComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    it('should return 403 if user is not the comment owner', async () => {
      req.params = { commentId: 'c1' };
      (req as any).user = { id: 'other' };
      req.body = { content: 'updated content' };
      mockedCommentService.getCommentById.mockResolvedValue(sampleComment);

      await updateComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });
      expect(mockedCommentService.updateComment).not.toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment and return 204', async () => {
      req.params = { commentId: 'c1' };
      (req as any).user = { id: 'u1' };
      mockedCommentService.getCommentById.mockResolvedValue(sampleComment);
      mockedCommentService.deleteComment.mockResolvedValue(true);

      await deleteComment(req as Request, res as Response);

      expect(mockedCommentService.getCommentById).toHaveBeenCalledWith('c1');
      expect(mockedCommentService.deleteComment).toHaveBeenCalledWith('c1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if comment to delete is not found', async () => {
      req.params = { commentId: 'nonexistent' };
      mockedCommentService.getCommentById.mockResolvedValue(null);

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    it('should return 403 if user is not the comment owner', async () => {
      req.params = { commentId: 'c1' };
      (req as any).user = { id: 'other' };
      mockedCommentService.getCommentById.mockResolvedValue(sampleComment);

      await deleteComment(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });
      expect(mockedCommentService.deleteComment).not.toHaveBeenCalled();
    });
  });

  describe('getCommentsByPost', () => {
    it('should return comments for a post and 200', async () => {
      req.params = { postId: 'p1' };
      const comments = [sampleComment];
      mockedCommentService.getCommentsByPostId.mockResolvedValue(comments);

      await getCommentsByPost(req as Request, res as Response);

      expect(mockedCommentService.getCommentsByPostId).toHaveBeenCalledWith('p1');
      expect(res.json).toHaveBeenCalledWith(comments);
    });
  });
});
