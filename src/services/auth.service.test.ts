import { register, login, refreshSession, logout } from './auth.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

jest.mock('../dal/index', () => {
    const userRepo = {
        getByUsername: jest.fn(),
        getByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        getById: jest.fn(),
    };
    return {
        __esModule: true,
        default: () => ({ userRepo }),
    };
});

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

import getRepositories from '../dal/index';

describe('Auth Service', () => {
    const { userRepo: mockUserRepo } = getRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            mockUserRepo.getByUsername.mockResolvedValue(null);
            mockUserRepo.getByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPass');
            mockUserRepo.create.mockResolvedValue({ id: '123' });
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const result = await register('test', 'test@test.com', 'pass');

            expect(mockUserRepo.create).toHaveBeenCalledWith({
                username: 'test',
                email: 'test@test.com',
                passwordHash: 'hashedPass',
            });
            expect(result).toHaveProperty('accessToken', 'token');
            expect(result).toHaveProperty('refreshToken', 'token');
        });

        it('should throw if username is taken', async () => {
            mockUserRepo.getByUsername.mockResolvedValue({ id: '1' });
            await expect(register('test', 'e', 'p')).rejects.toThrow('username_taken');
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const user = { id: '1', username: 'u', email: 'e', passwordHash: 'h' };
            mockUserRepo.getByUsername.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token');

            const result = await login('u', 'p');
            expect(result.user.id).toBe('1');
            expect(result.accessToken).toBe('token');
        });

        it('should throw invalid credentials if user not found', async () => {
            mockUserRepo.getByUsername.mockResolvedValue(null);
            mockUserRepo.getByEmail.mockResolvedValue(null);
            await expect(login('u', 'p')).rejects.toThrow('invalid_credentials');
        });
    });

    describe('refreshSession', () => {
        it('should refresh tokens successfully', async () => {
            (jwt.verify as jest.Mock).mockReturnValue({ userId: '1' });
            mockUserRepo.getById.mockResolvedValue({ id: '1', refreshTokens: ['oldRef'] });
            (jwt.sign as jest.Mock).mockReturnValue('newRef');

            const result = await refreshSession('oldRef');
            expect(result.accessToken).toBe('newRef');
            expect(mockUserRepo.update).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should remove refresh token', async () => {
            mockUserRepo.getById.mockResolvedValue({ id: '1', refreshTokens: ['t1', 't2'] });
            await logout('1', 't1');
            expect(mockUserRepo.update).toHaveBeenCalledWith('1', { refreshTokens: ['t2'] });
        });
    });
});
