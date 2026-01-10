import express from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());

const swaggerDocument = {
	openapi: '3.0.0',
	info: { title: 'Colman Web Assignment API', version: '1.0.0', description: 'API docs for local Swagger UI' },
	tags: [
		{ name: 'Posts', description: 'Operations on posts' },
		{ name: 'Comments', description: 'Operations on comments' },
		{ name: 'Example', description: 'Example endpoints' },
		{ name: 'Health', description: 'Health and readiness checks' },
	],
	components: {
		schemas: {
			Post: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					senderId: { type: 'string' },
					title: { type: 'string' },
					content: { type: 'string' },
					createdAt: { type: 'string', format: 'date-time' },
					updatedAt: { type: 'string', format: 'date-time' },
				},
				required: ['id', 'senderId', 'title', 'content', 'createdAt', 'updatedAt'],
			},
			PostCreate: {
				type: 'object',
				properties: { senderId: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' } },
				required: ['senderId', 'title', 'content'],
			},
			PostUpdate: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' } } },
			Comment: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					postId: { type: 'string' },
					senderId: { type: 'string' },
					content: { type: 'string' },
					createdAt: { type: 'string', format: 'date-time' },
					updatedAt: { type: 'string', format: 'date-time' },
				},
				required: ['id', 'postId', 'senderId', 'content', 'createdAt', 'updatedAt'],
			},
			CommentCreate: { type: 'object', properties: { postId: { type: 'string' }, senderId: { type: 'string' }, content: { type: 'string' } }, required: ['postId', 'senderId', 'content'] },
			CommentUpdate: { type: 'object', properties: { content: { type: 'string' } } },
			HealthOK: { type: 'object', properties: { ok: { type: 'boolean' }, info: { type: 'string' } } },
			HealthError: { type: 'object', properties: { ok: { type: 'boolean' }, error: { type: 'string' } } },
		},
	},
	paths: {
		'/api/health/mongo': {
			get: {
				tags: ['Health'],
				summary: 'Check MongoDB connection',
				description: 'Attempts a short connection to MongoDB using configured credentials (MONGO_USER/MONGO_PASS or MONGO_URI).',
				responses: {
					'200': { description: 'Mongo reachable', content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthOK' } } } },
					'503': { description: 'Mongo unreachable', content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthError' } } } },
				},
			},
		},
		'/api/example': { get: { summary: 'Example endpoint root', tags: ['Example'], responses: { '200': { description: 'OK' } } } },
		'/api/example/ping': {
			get: {
				summary: 'Ping endpoint',
				tags: ['Example'],
				description: 'Returns pong',
				responses: { '200': { description: 'pong response', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } } },
			},
		},
		'/api/post': {
			post: {
				tags: ['Posts'],
				summary: 'Create a new post',
				requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostCreate' } } } },
				responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } } },
			},
			get: {
				tags: ['Posts'],
				summary: 'List posts (optional filter by sender via ?sender=)',
				parameters: [{ name: 'sender', in: 'query', schema: { type: 'string' }, required: false, description: 'Filter posts by senderId' }],
				responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } },
			},
		},
		'/api/post/{postId}': {
			get: {
				tags: ['Posts'],
				summary: 'Get post by id',
				parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
				responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '404': { description: 'Not Found' } },
			},
			put: {
				tags: ['Posts'],
				summary: 'Update post',
				parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
				requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostUpdate' } } } },
				responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '404': { description: 'Not Found' } },
			},
		},
		'/api/post/{postId}/comments': {
			get: {
				tags: ['Posts', 'Comments'],
				summary: "Get comments for a post",
				parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
				responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } } },
			},
		},
		'/api/comment': {
			post: { tags: ['Comments'], summary: 'Create a new comment', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentCreate' } } } }, responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } } } },
		},
		'/api/comment/{commentId}': {
			get: { tags: ['Comments'], summary: 'Get comment by id', parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } }, '404': { description: 'Not Found' } } },
			put: { tags: ['Comments'], summary: 'Update comment', parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentUpdate' } } } }, responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } }, '404': { description: 'Not Found' } } },
			'delete': { tags: ['Comments'], summary: 'Delete comment', parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'No Content' }, '404': { description: 'Not Found' } } },
		},
	},
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

// central error handler
app.use(errorHandler);

export default app;
