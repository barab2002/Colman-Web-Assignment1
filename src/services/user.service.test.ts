import { createUser, getUserById, getAllUsers, updateUser, deleteUser } from './user.service';
import bcrypt from 'bcryptjs';

jest.mock('../dal/index', () => {
    const userRepo = {
        getByUsername: jest.fn(),
        getByEmail: jest.fn(),
        create: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    return {
        __esModule: true,
        default: () => ({ userRepo }),
    };
});

jest.mock('bcryptjs');

import getRepositories from '../dal/index';

describe('User Service', () => {
    const { userRepo: mockUserRepo } = getRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create user successfully', async () => {
            mockUserRepo.getByUsername.mockResolvedValue(null);
            mockUserRepo.getByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
            mockUserRepo.create.mockResolvedValue({ id: '1', username: 'u', email: 'e' });

            const result = await createUser({ username: 'u', email: 'e', password: 'p' });
            expect(mockUserRepo.create).toHaveBeenCalledWith({ username: 'u', email: 'e', passwordHash: 'hashed' });
            expect(result).toEqual({ id: '1', username: 'u', email: 'e' });
        });

        it('should throw if username taken', async () => {
            mockUserRepo.getByUsername.mockResolvedValue({ id: '1' });
            await expect(createUser({ username: 'u', email: 'e', password: 'p' })).rejects.toThrow('username_taken');
        });

        it('should throw if email taken', async () => {
            mockUserRepo.getByUsername.mockResolvedValue(null);
            mockUserRepo.getByEmail.mockResolvedValue({ id: '1' });
            await expect(createUser({ username: 'u', email: 'e', password: 'p' })).rejects.toThrow('email_taken');
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            mockUserRepo.getById.mockResolvedValue({ id: '1' });
            const result = await getUserById('1');
            expect(mockUserRepo.getById).toHaveBeenCalledWith('1');
            expect(result).toEqual({ id: '1' });
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            mockUserRepo.getAll.mockResolvedValue(['u1', 'u2']);
            const result = await getAllUsers();
            expect(mockUserRepo.getAll).toHaveBeenCalled();
            expect(result).toEqual(['u1', 'u2']);
        });
    });

    describe('updateUser', () => {
        it('should update user without password', async () => {
            mockUserRepo.update.mockResolvedValue({ id: '1', username: 'new' });
            const result = await updateUser('1', { username: 'new' });
            expect(mockUserRepo.update).toHaveBeenCalledWith('1', { username: 'new' });
            expect(result).toEqual({ id: '1', username: 'new' });
        });

        it('should update user with password hashing', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('newHash');
            mockUserRepo.update.mockResolvedValue({ id: '1', passwordHash: 'newHash' });
            const result = await updateUser('1', { password: 'newPass' });
            expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 8);
            expect(mockUserRepo.update).toHaveBeenCalledWith('1', { password: 'newPass', passwordHash: 'newHash' });
            expect(result).toEqual({ id: '1', passwordHash: 'newHash' });
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            mockUserRepo.delete.mockResolvedValue(true);
            const result = await deleteUser('1');
            expect(mockUserRepo.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });
    });
});
