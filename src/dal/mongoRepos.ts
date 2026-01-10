import { PostRepository, CommentRepository } from './interfaces';
import { PostMongoRepository } from './mongo/post.mongo.repo';
import { CommentMongoRepository } from './mongo/comment.mongo.repo';

export class MongoPostRepository extends PostMongoRepository implements PostRepository {}
export class MongoCommentRepository extends CommentMongoRepository implements CommentRepository {}
