import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export async function registerUser(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email and password are required' });
  try {
    const created = await userService.createUser({ username, email, password });
    res.status(201).json(created);
  } catch (err: any) {
    if (err.message === 'username_taken' || err.message === 'email_taken') return res.status(409).json({ error: err.message });
    res.status(500).json({ error: 'internal_error' });
  }
}

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
}

export async function updateUser(req: Request, res: Response) {
  const { userId } = req.params;
  const data = req.body;
  const updated = await userService.updateUser(userId, data);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const { userId } = req.params;
  const ok = await userService.deleteUser(userId);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
}
