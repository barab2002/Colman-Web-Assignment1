import { Request, Response } from 'express';
import * as commentService from '../services/comment.service';

export async function createComment(req: Request, res: Response) {
  const { postId, senderId, content } = req.body;
  if (!postId || !senderId || !content) return res.status(400).json({ error: 'postId, senderId and content are required' });
  const created = await commentService.createComment({ postId, senderId, content });
  res.status(201).json(created);
}

export async function getComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const comment = await commentService.getCommentById(commentId);
  if (!comment) return res.status(404).json({ error: 'Not found' });
  res.json(comment);
}

export async function updateComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const data = req.body;
  const updated = await commentService.updateComment(commentId, data);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
}

export async function deleteComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const ok = await commentService.deleteComment(commentId);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
}

export async function getCommentsByPost(req: Request, res: Response) {
  const { postId } = req.params;
  const comments = await commentService.getCommentsByPostId(postId);
  res.json(comments);
}
