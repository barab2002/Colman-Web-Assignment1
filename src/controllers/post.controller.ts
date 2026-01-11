import { Request, Response } from 'express';
import * as postService from '../services/post.service';

export async function createPost(req: Request, res: Response) {
  const { title, content } = req.body;
  const senderId = (req as any).user?.id || req.body.senderId;
  if (!senderId || !title || !content) return res.status(400).json({ error: 'senderId, title and content are required' });
  const created = await postService.createPost({ senderId, title, content });
  res.status(201).json(created);
}

export async function getPosts(req: Request, res: Response) {
  const { sender } = req.query as any;
  const posts = await postService.getAllPosts(sender);
  res.json(posts);
}

export async function getPost(req: Request, res: Response) {
  const { postId } = req.params;
  const post = await postService.getPostById(postId);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
}

export async function updatePost(req: Request, res: Response) {
  const { postId } = req.params;
  const data = req.body;
  const updated = await postService.updatePost(postId, data);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
}
