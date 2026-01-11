import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || '';
  if (!auth) return res.status(401).json({ error: 'missing_authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid_authorization_format' });
  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme) && !/^JWT$/i.test(scheme)) return res.status(401).json({ error: 'invalid_authorization_scheme' });
  try {
    const payload: any = (jwt as any).verify(token, config.JWT_SECRET as any);
    (req as any).user = { id: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}
