import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { mongoHealth } from './health.controller';
import { config } from '../config/env';

jest.mock('mongodb');
jest.mock('../config/env', () => ({
  config: {
    MONGO_URI: 'mongodb://testuser:testpass@localhost:27017/testdb',
    MONGO_DB: 'testdb',
    MONGO_USER: 'testuser',
    MONGO_PASS: 'testpass',
  },
}));

const mockedMongoClient = MongoClient as jest.MockedClass<typeof MongoClient>;

describe('Health Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockedMongoClient.mockClear();
  });

  const mockMongoSuccess = () => {
    const mockPing = jest.fn().mockResolvedValue(true);
    const mockAdmin = jest.fn(() => ({ admin: () => ({ ping: mockPing }) }));
    const mockConnect = jest.fn().mockResolvedValue(true);
    const mockClose = jest.fn().mockResolvedValue(true);
    mockedMongoClient.mockImplementation(() => ({
      connect: mockConnect,
      db: mockAdmin,
      close: mockClose,
    } as any));
  };

  const mockMongoFailure = (error = new Error('Connection failed')) => {
    const mockConnect = jest.fn().mockRejectedValue(error);
    const mockClose = jest.fn().mockResolvedValue(true);
    mockedMongoClient.mockImplementation(() => ({
      connect: mockConnect,
      close: mockClose,
    } as any));
  };

  it('should return ok:true on successful connection', async () => {
    mockMongoSuccess();
    await mongoHealth(req as Request, res as Response);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  it('should return ok:false on connection failure', async () => {
    mockMongoFailure();
    await mongoHealth(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: false }));
  });

  it('should try a fallback with authSource=admin on auth failure', async () => {
    const authError = new Error('Authentication failed');
    mockMongoFailure(authError);

    const mockConnectSuccess = jest.fn().mockResolvedValue(true);
    const mockPing = jest.fn().mockResolvedValue(true);
    const mockAdmin = jest.fn(() => ({ admin: () => ({ ping: mockPing }) }));
    const mockClose = jest.fn().mockResolvedValue(true);
    
    mockedMongoClient
        .mockImplementationOnce(() => ({ 
            connect: jest.fn().mockRejectedValue(authError),
            close: jest.fn().mockResolvedValue(true)
        } as any))
        .mockImplementationOnce(() => ({ 
            connect: mockConnectSuccess,
            db: mockAdmin,
            close: mockClose
        } as any));

    await mongoHealth(req as Request, res as Response);

    expect(mockedMongoClient).toHaveBeenCalledTimes(2);
    expect(mockedMongoClient.mock.calls[1][0]).toContain('authSource=admin');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });

  it('should return safe config details', async () => {
    mockMongoSuccess();
    await mongoHealth(req as Request, res as Response);

    const expectedConfig = {
      MONGO_URI: 'mongodb://<redacted>@localhost:27017',
      MONGO_DB: 'testdb',
      MONGO_USER: 'testuser',
      hasPassword: true,
    };

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      config: expect.any(Object)
    }));
    
    const actualConfig = (res.json as jest.Mock).mock.calls[0][0].config;
    expect(actualConfig.MONGO_DB).toEqual(expectedConfig.MONGO_DB);
    expect(actualConfig.MONGO_USER).toEqual(expectedConfig.MONGO_USER);
    expect(actualConfig.hasPassword).toEqual(expectedConfig.hasPassword);
    expect(actualConfig.MONGO_URI).toContain('<redacted>');
  });
});
