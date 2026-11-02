import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDb();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();