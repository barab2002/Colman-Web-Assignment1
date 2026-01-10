import app from './app';
import { config } from './config/env';
import { connectIfNeeded } from './db/mongoClient';

const PORT = config.PORT || 3000;

(async () => {
  try {
    await connectIfNeeded();
  } catch (err) {
    // if mongo is required but not available, fail fast in dev; in production you may want different behavior
    if ((config.DB_TYPE || 'JSON').toUpperCase() === 'MONGO') {
      console.error('Mongo connection failed and DB_TYPE=MONGO. Exiting.');
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${config.NODE_ENV})`);
  });
})();
