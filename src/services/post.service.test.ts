import { createPost, getAllPosts, getPostById, updatePost } from './post.service';

jest.mock('../dal/index', () => {
    const postRepo = {
        create: jest.fn(),
        getAll: jest.fn(),
        getBySender: jest.fn(),
        getById: jest.fn(),
        update: jest.fn(),
    };
    return {
        __esModule: true,
        default: () => ({ postRepo }),
    };
});

import getRepositories from '../dal/index';

describe('Post Service', () => {
    const { postRepo: mockPostRepo } = getRepositories();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        it('should create a post successfully', async () => {
            const data = { title: 'Test Post' };
            mockPostRepo.create.mockResolvedValue({ id: '1', ...data });

            const result = await createPost(data);
            expect(mockPostRepo.create).toHaveBeenCalledWith(data);
            expect(result).toEqual({ id: '1', ...data });
        });
    });

    describe('getAllPosts', () => {
        it('should return all posts when no senderId provided', async () => {
            mockPostRepo.getAll.mockResolvedValue(['p1', 'p2']);
            const result = await getAllPosts();
            expect(mockPostRepo.getAll).toHaveBeenCalled();
            expect(result).toEqual(['p1', 'p2']);
        });

        it('should return posts by senderId when provided', async () => {
            mockPostRepo.getBySender.mockResolvedValue(['p3']);
            const result = await getAllPosts('sender1');
            expect(mockPostRepo.getBySender).toHaveBeenCalledWith('sender1');
            expect(result).toEqual(['p3']);
        });
    });

    describe('getPostById', () => {
        it('should return post by id', async () => {
            mockPostRepo.getById.mockResolvedValue({ id: '1' });
            const result = await getPostById('1');
            expect(mockPostRepo.getById).toHaveBeenCalledWith('1');
            expect(result).toEqual({ id: '1' });
        });
    });

    describe('updatePost', () => {
        it('should update post successfully', async () => {
            mockPostRepo.update.mockResolvedValue({ id: '1', title: 'Updated' });
            const result = await updatePost('1', { title: 'Updated' });
            expect(mockPostRepo.update).toHaveBeenCalledWith('1', { title: 'Updated' });
            expect(result).toEqual({ id: '1', title: 'Updated' });
        });
    });
});
