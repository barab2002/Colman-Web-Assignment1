import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { register, login, refresh, logout } from './auth.controller';

jest.mock('../services/auth.service');
const mockedAuthService = authService as unknown as {
  register: jest.Mock<any, any>;
  login: jest.Mock<any, any>;
  refreshSession: jest.Mock<any, any>;
  logout: jest.Mock<any, any>;
};

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register and return tokens', async () => {
      req.body = { username: 'bob', email: 'b@e.com', password: 'p' };
      mockedAuthService.register.mockResolvedValue({ user: { id: 'u1', username: 'bob', email: 'b@e.com' }, accessToken: 'a', refreshToken: 'r' });
      await register(req as Request, res as Response);
      expect(mockedAuthService.register).toHaveBeenCalledWith('bob', 'b@e.com', 'p');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if missing fields', async () => {
      req.body = { username: 'bob' };
      await register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should login and return tokens', async () => {
      req.body = { usernameOrEmail: 'bob', password: 'p' };
      mockedAuthService.login.mockResolvedValue({ user: { id: 'u1' }, accessToken: 'a', refreshToken: 'r' });
      await login(req as Request, res as Response);
      expect(mockedAuthService.login).toHaveBeenCalledWith('bob', 'p');
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if missing fields', async () => {
      req.body = { usernameOrEmail: 'bob' };
      await login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      req.body = { refreshToken: 'r' };
      mockedAuthService.refreshSession.mockResolvedValue({ accessToken: 'a2', refreshToken: 'r2' });
      await refresh(req as Request, res as Response);
      expect(mockedAuthService.refreshSession).toHaveBeenCalledWith('r');
      expect(res.json).toHaveBeenCalledWith({ accessToken: 'a2', refreshToken: 'r2' });
    });

    it('should return 400 if missing token', async () => {
      req.body = {};
      await refresh(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('logout', () => {
    it('should logout and return 204', async () => {
      req.body = { userId: 'u1', refreshToken: 'r' };
      mockedAuthService.logout.mockResolvedValue(undefined as any);
      await logout(req as Request, res as Response);
      expect(mockedAuthService.logout).toHaveBeenCalledWith('u1', 'r');
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 400 if missing userId', async () => {
      req.body = {};
      await logout(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
