import express from 'express';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());

import swaggerDocument from './config/swagger';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

export default app;
