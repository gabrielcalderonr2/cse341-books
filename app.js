import express from 'express';
import { createRouter } from './src/router.js';

const createApp = (getDatabase) => {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    return res.status(200).json({
      message: 'Server is running'
    });
  });

  app.use('/', createRouter(getDatabase));

  return app;
};

const app = createApp();

export { createApp };
export default app;