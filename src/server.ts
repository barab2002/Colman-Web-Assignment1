import app from './app';
import { config } from './config/env';
import { connectIfNeeded } from './db/mongoClient';
import connectMongo from './config/mongo';

const PORT = config.PORT || 3000;

(async () => {
  try {
    await connectIfNeeded();
    // Ensure mongoose is connected before starting the server so Mongoose
    // operations (create/update) don't buffer and time out.
    await connectMongo();
    console.log('Mongoose connected');
  } catch (err) {
    console.error('Mongo connection failed. Exiting.');
    console.error(err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (${config.NODE_ENV})`);
  });
})();
