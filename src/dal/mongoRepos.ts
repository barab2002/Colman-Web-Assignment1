import { PostRepository, CommentRepository, UserRepository } from './interfaces';
import { PostMongoRepository } from './mongo/post.mongo.repo';
import { CommentMongoRepository } from './mongo/comment.mongo.repo';
import { UserMongoRepository } from './mongo/user.mongo.repo';

export class MongoPostRepository extends PostMongoRepository implements PostRepository {}
export class MongoCommentRepository extends CommentMongoRepository implements CommentRepository {}
export class MongoUserRepository extends UserMongoRepository implements UserRepository {}
