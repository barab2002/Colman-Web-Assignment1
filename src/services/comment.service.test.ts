import { createComment, getCommentById, getCommentsByPostId, updateComment, deleteComment } from './comment.service';

jest.mock('../dal/index', () => {
    const commentRepo = {
        create: jest.fn(),
        getById: jest.fn(),
        getByPostId: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    return {
        __esModule: true,
        default: () => ({ commentRepo }),
    };
});

import getRepositories from '../dal/index';

describe('Comment Service', () => {
    const { commentRepo: mockCommentRepo } = getRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createComment', () => {
        it('should create a comment successfully', async () => {
            const data = { content: 'Content' };
            mockCommentRepo.create.mockResolvedValue({ id: '1', ...data });
            const result = await createComment(data);
            expect(mockCommentRepo.create).toHaveBeenCalledWith(data);
            expect(result).toEqual({ id: '1', ...data });
        });
    });

    describe('getCommentById', () => {
        it('should return comment by id', async () => {
            mockCommentRepo.getById.mockResolvedValue({ id: '1' });
            const result = await getCommentById('1');
            expect(mockCommentRepo.getById).toHaveBeenCalledWith('1');
            expect(result).toEqual({ id: '1' });
        });
    });

    describe('getCommentsByPostId', () => {
        it('should return comments for post', async () => {
            mockCommentRepo.getByPostId.mockResolvedValue(['c1', 'c2']);
            const result = await getCommentsByPostId('p1');
            expect(mockCommentRepo.getByPostId).toHaveBeenCalledWith('p1');
            expect(result).toEqual(['c1', 'c2']);
        });
    });

    describe('updateComment', () => {
        it('should update comment successfully', async () => {
            mockCommentRepo.update.mockResolvedValue({ id: '1', content: 'New' });
            const result = await updateComment('1', { content: 'New' });
            expect(mockCommentRepo.update).toHaveBeenCalledWith('1', { content: 'New' });
            expect(result).toEqual({ id: '1', content: 'New' });
        });
    });

    describe('deleteComment', () => {
        it('should delete comment successfully', async () => {
            mockCommentRepo.delete.mockResolvedValue(true);
            const result = await deleteComment('1');
            expect(mockCommentRepo.delete).toHaveBeenCalledWith('1');
            expect(result).toBe(true);
        });
    });
});
