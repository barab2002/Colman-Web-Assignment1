import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { registerUser, getUsers, getUser, updateUser, deleteUser } from './user.controller';
import { User } from '../dal/models';

jest.mock('../services/user.service');
const mockedUserService = userService as jest.Mocked<typeof userService>;

describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  const now = new Date();
  const sampleUser: User = { id: 'u1', username: 'bob', email: 'bob@example.com', createdAt: now.toISOString(), updatedAt: now.toISOString() };

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create a user and return 201', async () => {
      req.body = { username: 'bob', email: 'bob@example.com', password: 'secret' };
      mockedUserService.createUser.mockResolvedValue(sampleUser as any);

      await registerUser(req as Request, res as Response);

      expect(mockedUserService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(sampleUser);
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { username: 'bob' };
      await registerUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getUsers', () => {
    it('should list users', async () => {
      mockedUserService.getAllUsers.mockResolvedValue([sampleUser as any]);
      await getUsers(req as Request, res as Response);
      expect(res.json).toHaveBeenCalledWith([sampleUser]);
    });
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      req.params = { userId: 'u1' };
      mockedUserService.getUserById.mockResolvedValue(sampleUser as any);
      await getUser(req as Request, res as Response);
      expect(mockedUserService.getUserById).toHaveBeenCalledWith('u1');
      expect(res.json).toHaveBeenCalledWith(sampleUser);
    });

    it('should return 404 when not found', async () => {
      req.params = { userId: 'nope' };
      mockedUserService.getUserById.mockResolvedValue(null);
      await getUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      req.params = { userId: 'u1' };
      req.body = { username: 'bob2' };
      const updated = { ...sampleUser, username: 'bob2' };
      mockedUserService.updateUser.mockResolvedValue(updated as any);
      await updateUser(req as Request, res as Response);
      expect(mockedUserService.updateUser).toHaveBeenCalledWith('u1', req.body);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return 404 when updating missing user', async () => {
      req.params = { userId: 'nope' };
      req.body = { username: 'bob2' };
      mockedUserService.updateUser.mockResolvedValue(null);
      await updateUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteUser', () => {
    it('should delete and return 204', async () => {
      req.params = { userId: 'u1' };
      mockedUserService.deleteUser.mockResolvedValue(true);
      await deleteUser(req as Request, res as Response);
      expect(mockedUserService.deleteUser).toHaveBeenCalledWith('u1');
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 when delete fails', async () => {
      req.params = { userId: 'nope' };
      mockedUserService.deleteUser.mockResolvedValue(false);
      await deleteUser(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
