const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Colman Web Assignment API Bar Abramovich & Idan Tepper',
    version: '1.0.0',
    description: 'Bar Abramovich 323098889 & Idan Tepper 212929103 - API Documentation',
  },
  tags: [
    { name: 'Posts', description: 'Operations on posts' },
    { name: 'Comments', description: 'Operations on comments' },
    { name: 'Health', description: 'Health and readiness checks' },
    { name: 'Users', description: 'User and profile operations' },
    { name: 'Auth', description: 'Authentication endpoints' },
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
      },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserCreate: {
          type: 'object',
          properties: { username: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' } },
          required: ['username', 'email', 'password'],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      CommentCreate: {
        type: 'object',
        properties: { postId: { type: 'string' }, senderId: { type: 'string' }, content: { type: 'string' } },
        required: ['postId', 'senderId', 'content'],
      },
      CommentUpdate: { type: 'object', properties: { content: { type: 'string' } } },
      HealthOK: { type: 'object', properties: { ok: { type: 'boolean' }, info: { type: 'string' } } },
      HealthError: { type: 'object', properties: { ok: { type: 'boolean' }, error: { type: 'string' } } },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
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
    '/api/post': {
      post: {
        tags: ['Posts'],
        summary: 'Create a new post',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostCreate' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } } },
      },
      get: {
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        summary: 'List posts (optional filter by sender via ?sender=)',
        parameters: [{ name: 'sender', in: 'query', schema: { type: 'string' }, required: false, description: 'Filter posts by senderId' }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } } },
      },
    },
    '/api/post/{postId}': {
      get: {
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        summary: 'Get post by id',
        parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '404': { description: 'Not Found' } },
      },
      put: {
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        summary: 'Update post',
        parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostUpdate' } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Post' } } } }, '404': { description: 'Not Found' } },
      },
    },
    '/api/post/{postId}/comments': {
      get: {
        tags: ['Posts'],
        security: [{ bearerAuth: [] }],
        summary: 'Get comments for a post',
        parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } } },
      },
    },
    '/api/users': {
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCreate' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
      },
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'List users',
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } } },
      },
    },
    '/api/users/{userId}': {
      get: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Get user by id',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '404': { description: 'Not Found' } },
      },
      put: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Update user',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } }, '404': { description: 'Not Found' } },
      },
      delete: {
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete user',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'No Content' }, '404': { description: 'Not Found' } },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user and return tokens',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UserCreate' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user and return tokens',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { usernameOrEmail: { type: 'string' }, password: { type: 'string' } }, required: ['usernameOrEmail','password'] } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '401': { description: 'Unauthorized' } },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh session using refresh token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string' }, refreshToken: { type: 'string' } } } } } }, '401': { description: 'Unauthorized' } },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and revoke refresh token',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' }, refreshToken: { type: 'string' } }, required: ['userId'] } } } },
        responses: { '204': { description: 'No Content' } },
      },
    },
    '/api/comment': {
      post: {
        tags: ['Comments'],
        summary: 'Create a new comment',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentCreate' } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } } },
      },
      // health check exposed via comments router
      '/health': {
        get: {
          tags: ['Comments'],
          summary: 'Check MongoDB connection (comments route)',
          description: 'Health check accessible via comments router',
          responses: {
            '200': { description: 'Mongo reachable', content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthOK' } } } },
            '503': { description: 'Mongo unreachable', content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthError' } } } },
          },
        },
      },
    },
    '/api/comment/{commentId}': {
      get: {
        tags: ['Comments'],
        security: [{ bearerAuth: [] }],
        summary: 'Get comment by id',
        parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } }, '404': { description: 'Not Found' } },
      },
      put: {
        tags: ['Comments'],
        security: [{ bearerAuth: [] }],
        summary: 'Update comment',
        parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentUpdate' } } } },
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } }, '404': { description: 'Not Found' } },
      },
      delete: {
        tags: ['Comments'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete comment',
        parameters: [{ name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'No Content' }, '404': { description: 'Not Found' } },
      },
    },
  },
};

export default swaggerDocument;
