import express from 'express';
import { createBooksController } from './controllers/books.js';
import { getDb } from './db/connect.js';

const createRouter = (getDatabase = getDb) => {
  const router = express.Router();

  const booksController = createBooksController(getDatabase);

  router.get('/books', booksController.getBooks);
  router.get('/books/:id', booksController.getBook);

  return router;
};

const router = createRouter();

export { createRouter };
export default router;