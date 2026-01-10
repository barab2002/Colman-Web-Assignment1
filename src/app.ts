import express from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());

const swaggerDocument = {
	openapi: '3.0.0',
	info: {
		title: 'Colman Web Assignment API',
		version: '1.0.0',
		description: 'Minimal OpenAPI spec for local Swagger UI',
	},
	paths: {
		'/api/example': {
			get: {
				summary: 'Example endpoint root',
				responses: { '200': { description: 'OK' } },
			},
		},
		'/api/example/ping': {
			get: {
				summary: 'Ping endpoint',
				description: 'Returns pong',
				responses: {
					'200': {
						description: 'pong response',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: { message: { type: 'string' } },
								},
							},
						},
					},
				},
			},
		},
	},
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

// central error handler
app.use(errorHandler);

export default app;
