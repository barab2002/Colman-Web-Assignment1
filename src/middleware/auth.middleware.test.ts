import { authenticate } from './auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('should return 401 if authorization header is missing', () => {
        authenticate(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'missing_authorization' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization format is invalid (no space)', () => {
        req.headers = { authorization: 'BearerToken' };

        authenticate(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'invalid_authorization_format' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization scheme is invalid', () => {
        req.headers = { authorization: 'Basic token123' };

        authenticate(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'invalid_authorization_scheme' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
        req.headers = { authorization: 'Bearer invalidToken' };
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        authenticate(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'invalid_token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() and attach user to req if token is valid', () => {
        req.headers = { authorization: 'Bearer validToken' };
        const mockPayload = { userId: '123' };
        (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

        authenticate(req as Request, res as Response, next);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', expect.anything());
        expect((req as any).user).toEqual({ id: '123' });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
