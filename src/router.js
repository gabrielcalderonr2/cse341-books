
import express from 'express';
import { createBooksController } from './controllers/books.js';
import { createAuthorsController } from './controllers/authors.js';
import { getDb } from './db/connect.js';

const createRouter = (getDatabase = getDb) => {
  const router = express.Router();

  const booksController = createBooksController(getDatabase);
  const authorsController = createAuthorsController(getDatabase);

  // =========================
  // BOOKS API DOCUMENTATION
  // =========================

  /**
   * @swagger
   * /books:
   *   get:
   *     summary: Get all books
   *     tags: [Books]
   *     responses:
   *       200:
   *         description: List of all books
   *       500:
   *         description: Internal server error
   */
  router.get('/books', booksController.getBooks);

  /**
   * @swagger
   * /books/{id}:
   *   get:
   *     summary: Get a book by ID
   *     tags: [Books]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Book found
   *       404:
   *         description: Book not found
   *       500:
   *         description: Internal server error
   */
  router.get('/books/:id', booksController.getBook);

  /**
   * @swagger
   * /books:
   *   post:
   *     summary: Create a new book
   *     tags: [Books]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - authorId
   *               - title
   *               - publicationDate
   *             properties:
   *               id:
   *                 type: string
   *                 example: b4
   *               authorId:
   *                 type: string
   *                 example: a4
   *               title:
   *                 type: string
   *                 example: Example Book
   *               publicationDate:
   *                 type: string
   *                 example: "2024-01-15"
   *     responses:
   *       201:
   *         description: Book created successfully
   *       400:
   *         description: Invalid fields, duplicate ID, or author does not exist
   *       500:
   *         description: Internal server error
   */
  router.post('/books', booksController.createBook);

  /**
   * @swagger
   * /books/{id}:
   *   put:
   *     summary: Update an existing book
   *     tags: [Books]
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
   *               - authorId
   *               - title
   *               - publicationDate
   *             properties:
   *               authorId:
   *                 type: string
   *                 example: a4
   *               title:
   *                 type: string
   *                 example: Updated Book Title
   *               publicationDate:
   *                 type: string
   *                 example: "2024-01-15"
   *     responses:
   *       200:
   *         description: Book updated successfully
   *       400:
   *         description: Invalid fields or author does not exist
   *       404:
   *         description: Book not found
   *       500:
   *         description: Internal server error
   */
  router.put('/books/:id', booksController.updateBook);

  /**
   * @swagger
   * /books/{id}:
   *   delete:
   *     summary: Delete a book
   *     tags: [Books]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Book deleted successfully
   *       404:
   *         description: Book not found
   *       500:
   *         description: Internal server error
   */
  router.delete('/books/:id', booksController.deleteBook);

  // =========================
  // AUTHORS API DOCUMENTATION
  // =========================

  /**
   * @swagger
   * /authors:
   *   get:
   *     summary: Get all authors
   *     tags: [Authors]
   *     responses:
   *       200:
   *         description: List of all authors
   *       500:
   *         description: Internal server error
   */
  router.get('/authors', authorsController.getAllAuthors);

  /**
   * @swagger
   * /authors/{id}:
   *   get:
   *     summary: Get an author by ID
   *     tags: [Authors]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Author found
   *       404:
   *         description: Author not found
   *       500:
   *         description: Internal server error
   */
  router.get('/authors/:id', authorsController.getAuthorById);

  /**
   * @swagger
   * /authors:
   *   post:
   *     summary: Create a new author
   *     tags: [Authors]
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
   *                 example: a7
   *               name:
   *                 type: string
   *                 example: Charles Dickens
   *               birthYear:
   *                 type: integer
   *                 example: 1812
   *     responses:
   *       201:
   *         description: Author created successfully
   *       400:
   *         description: Invalid fields or duplicate ID
   *       500:
   *         description: Internal server error
   */
  router.post('/authors', authorsController.createAuthor);

  /**
   * @swagger
   * /authors/{id}:
   *   put:
   *     summary: Update an existing author
   *     tags: [Authors]
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
   *                 example: Charles Dickens
   *               birthYear:
   *                 type: integer
   *                 example: 1812
   *     responses:
   *       200:
   *         description: Author updated successfully
   *       400:
   *         description: Invalid fields
   *       404:
   *         description: Author not found
   *       500:
   *         description: Internal server error
   */
  router.put('/authors/:id', authorsController.updateAuthor);

  /**
   * @swagger
   * /authors/{id}:
   *   delete:
   *     summary: Delete an author
   *     tags: [Authors]
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
   *         description: Author cannot be deleted because they have associated books
   *       500:
   *         description: Internal server error
   */
  router.delete('/authors/:id', authorsController.deleteAuthor);

  return router;
};

const router = createRouter();

export { createRouter };
export default router;
