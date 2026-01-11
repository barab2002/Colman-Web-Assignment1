import getRepositories from '../dal/index';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';

const { userRepo } = getRepositories();

function signAccessToken(payload: object) {
  return (jwt as any).sign(payload, config.JWT_SECRET as any, { expiresIn: config.JWT_EXPIRES_IN } as any);
}

function signRefreshToken(payload: object) {
  return (jwt as any).sign(payload, config.JWT_SECRET as any, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN } as any);
}

export async function register(username: string, email: string, password: string) {

  const existingUser = await userRepo.getByUsername(username);
  if (existingUser) throw new Error('username_taken');
  const existingEmail = await userRepo.getByEmail(email);
  if (existingEmail) throw new Error('email_taken');
  const passwordHash = await bcrypt.hash(password, 8);
  const created = await userRepo.create({ username, email, passwordHash });
  const accessToken = signAccessToken({ userId: created.id });
  const refreshToken = signRefreshToken({ userId: created.id });

  await userRepo.update(created.id, { refreshTokens: [refreshToken] });
  return { user: created, accessToken, refreshToken };
}

export async function login(usernameOrEmail: string, password: string) {
  const byUsername = await userRepo.getByUsername(usernameOrEmail);
  const byEmail = await userRepo.getByEmail(usernameOrEmail);
  const user = byUsername || byEmail;
  if (!user) throw new Error('invalid_credentials');
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) throw new Error('invalid_credentials');
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  const currentTokens = user.refreshTokens || [];
  await userRepo.update(user.id, { refreshTokens: [...currentTokens, refreshToken] });
  return { user: { id: user.id, username: user.username, email: user.email }, accessToken, refreshToken };
}

export async function refreshSession(refreshToken: string) {
  try {
    const payload: any = (jwt as any).verify(refreshToken, config.JWT_SECRET as any);
    const userId = payload.userId;
    const user = await userRepo.getById(userId);
    if (!user) throw new Error('invalid_refresh');
    const tokens = user.refreshTokens || [];
    if (!tokens.includes(refreshToken)) throw new Error('invalid_refresh');

    const accessToken = signAccessToken({ userId });
    const newRefresh = signRefreshToken({ userId });
    const newTokens = tokens.filter((t: string) => t !== refreshToken).concat([newRefresh]);
    await userRepo.update(userId, { refreshTokens: newTokens });
    return { accessToken, refreshToken: newRefresh };
  } catch (err) {
    throw new Error('invalid_refresh');
  }
}

export async function logout(userId: string, refreshToken?: string) {
  const user = await userRepo.getById(userId);
  if (!user) return;
  if (!refreshToken) {
    await userRepo.update(userId, { refreshTokens: [] });
    return;
  }
  const tokens = user.refreshTokens || [];
  await userRepo.update(userId, { refreshTokens: tokens.filter((t: string) => t !== refreshToken) });
}
