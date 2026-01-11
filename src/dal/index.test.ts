import { getRepositories } from './index';
import { MongoPostRepository, MongoCommentRepository } from './mongoRepos';

jest.mock('./mongoRepos', () => ({
  MongoPostRepository: jest.fn(),
  MongoCommentRepository: jest.fn(),
}));

const mockedMongoPostRepository = MongoPostRepository as jest.MockedClass<typeof MongoPostRepository>;
const mockedMongoCommentRepository = MongoCommentRepository as jest.MockedClass<typeof MongoCommentRepository>;

describe('getRepositories', () => {
  beforeEach(() => {
    mockedMongoPostRepository.mockClear();
    mockedMongoCommentRepository.mockClear();
  });

  it('should return an object with postRepo and commentRepo properties', () => {
    const repositories = getRepositories();
    expect(repositories).toHaveProperty('postRepo');
    expect(repositories).toHaveProperty('commentRepo');
  });

  it('should create new instances of MongoPostRepository and MongoCommentRepository', () => {
    getRepositories();
    expect(MongoPostRepository).toHaveBeenCalledTimes(1);
    expect(MongoCommentRepository).toHaveBeenCalledTimes(1);
  });

  it('should return instances of MongoPostRepository and MongoCommentRepository', () => {
    const postRepoInstance = new MongoPostRepository();
    const commentRepoInstance = new MongoCommentRepository();
    mockedMongoPostRepository.mockImplementation(() => postRepoInstance);
    mockedMongoCommentRepository.mockImplementation(() => commentRepoInstance);

    const repositories = getRepositories();
    
    expect(repositories.postRepo).toBe(postRepoInstance);
    expect(repositories.commentRepo).toBe(commentRepoInstance);
  });
});
