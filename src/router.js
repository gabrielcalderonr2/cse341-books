import { createAuthorsController } from './controllers/authors.js';
import express from 'express';
import { createBooksController } from './controllers/books.js';
import { getDb } from './db/connect.js';

const createRouter = (getDatabase = getDb) => {
  const router = express.Router();

  const booksController = createBooksController(getDatabase);
  const authorsController = createAuthorsController(getDatabase);

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

  /**
   * @openapi
   * /authors:
   *   get:
   *     summary: Get all authors
   *     tags:
   *       - Authors
   *     responses:
   *       200:
   *         description: A list of authors
   *       500:
   *         description: Unable to retrieve authors
   */
  router.get('/authors', authorsController.getAllAuthors);

  /**
   * @openapi
   * /authors/{id}:
   *   get:
   *     summary: Get one author by id
   *     tags:
   *       - Authors
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Custom author id, such as a1
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Author returned successfully
   *       404:
   *         description: Author not found
   *       500:
   *         description: Unable to retrieve author
   */
  router.get('/authors/:id', authorsController.getAuthorById);

  /**
   * @openapi
   * /authors:
   *   post:
   *     summary: Create a new author
   *     tags:
   *       - Authors
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - name
   *               - birthYear
   *             properties:
   *               id:
   *                 type: string
   *                 example: a4
   *               name:
   *                 type: string
   *                 example: Example Author
   *               birthYear:
   *                 type: integer
   *                 example: 1980
   *     responses:
   *       201:
   *         description: Author created successfully
   *       400:
   *         description: Invalid fields or duplicate author id
   *       500:
   *         description: Unable to create author
   */
  router.post('/authors', authorsController.createAuthor);

  /**
   * @openapi
   * /authors/{id}:
   *   put:
   *     summary: Update an existing author
   *     tags:
   *       - Authors
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - birthYear
   *             properties:
   *               name:
   *                 type: string
   *                 example: Updated Author
   *               birthYear:
   *                 type: integer
   *                 example: 1981
   *     responses:
   *       200:
   *         description: Author updated successfully
   *       400:
   *         description: Invalid or missing fields
   *       404:
   *         description: Author not found
   *       500:
   *         description: Unable to update author
   */
  router.put('/authors/:id', authorsController.updateAuthor);

  /**
   * @openapi
   * /authors/{id}:
   *   delete:
   *     summary: Delete an author
   *     tags:
   *       - Authors
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Author deleted successfully
   *       404:
   *         description: Author not found
   *       409:
   *         description: Author cannot be deleted because they still have books
   *       500:
   *         description: Unable to delete author
   */
  router.delete('/authors/:id', authorsController.deleteAuthor);

  return router;
};

const router = createRouter();

export { createRouter };
export default router;
