import express from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

app.use('/api', routes);

// central error handler
app.use(errorHandler);

export default app;
