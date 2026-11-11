
import express from 'express';
import { createBooksController } from './controllers/books.js';
import { getDb } from './db/connect.js';

const createRouter = (getDatabase = getDb) => {
  const router = express.Router();

  const booksController = createBooksController(getDatabase);

  /**
   * @openapi
   * /books:
   *   get:
   *     summary: Get all books
   *     tags:
   *       - Books
   *     responses:
   *       200:
   *         description: Books returned successfully
   *       500:
   *         description: Unable to retrieve books
   */
  router.get('/books', booksController.getBooks);

  /**
   * @openapi
   * /books/{id}:
   *   get:
   *     summary: Get one book by id
   *     tags:
   *       - Books
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The custom book id, such as b1
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Book returned successfully
   *       404:
   *         description: Book not found
   *       500:
   *         description: Unable to retrieve book
   */
  router.get('/books/:id', booksController.getBook);

  return router;
};

const router = createRouter();

export { createRouter };
export default router;
