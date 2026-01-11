import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email and password are required' });
  try {
    const result = await authService.register(username, email, password);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.message === 'username_taken' || err.message === 'email_taken') return res.status(409).json({ error: err.message });
    res.status(500).json({ error: 'internal_error' });
  }
}

export async function login(req: Request, res: Response) {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) return res.status(400).json({ error: 'usernameOrEmail and password are required' });
  try {
    const result = await authService.login(usernameOrEmail, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: 'invalid_credentials' });
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });
  try {
    const tokens = await authService.refreshSession(refreshToken);
    res.json(tokens);
  } catch (err: any) {
    res.status(401).json({ error: 'invalid_refresh' });
  }
}

export async function logout(req: Request, res: Response) {
  const { userId, refreshToken } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });
  await authService.logout(userId, refreshToken);
  res.status(204).send();
}
