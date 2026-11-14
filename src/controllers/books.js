
import {
  getAllBooks,
  getBookById,
  createBook as createBookInDb,
  updateBook as updateBookInDb,
  deleteBook as deleteBookInDb,
  authorExists,
} from '../models/books.js';

const createBooksController = (getDatabase) => {
  const getBooks = async (req, res) => {
    try {
      const books = await getAllBooks(getDatabase());

      return res.status(200).json(books);
    } catch (error) {
      console.error('Failed to retrieve books:', error.message);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  const getBook = async (req, res) => {
    try {
      const book = await getBookById(
        getDatabase(),
        req.params.id
      );

      if (!book) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }

      return res.status(200).json(book);
    } catch (error) {
      console.error('Failed to retrieve book:', error.message);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  const createBook = async (req, res) => {
    try {
      const { id, authorId, title, publicationDate } = req.body || {};

      if (
        typeof id !== 'string' ||
        !id.trim() ||
        typeof authorId !== 'string' ||
        !authorId.trim() ||
        typeof title !== 'string' ||
        !title.trim() ||
        typeof publicationDate !== 'string' ||
        !publicationDate.trim()
      ) {
        return res.status(400).json({
          message: 'Invalid or missing book fields',
        });
      }

      const database = getDatabase();

      const existingBook = await getBookById(database, id.trim());

      if (existingBook) {
        return res.status(400).json({
          message: 'Book id already exists',
        });
      }

      const validAuthor = await authorExists(database, authorId.trim());

      if (!validAuthor) {
        return res.status(400).json({
          message: 'Author does not exist',
        });
      }

      const newBook = {
        id: id.trim(),
        authorId: authorId.trim(),
        title: title.trim(),
        publicationDate: publicationDate.trim(),
      };

      const createdBook = await createBookInDb(database, newBook);

      return res.status(201).json(createdBook);
    } catch (error) {
      console.error('Failed to create book:', error.message);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  const updateBook = async (req, res) => {
    try {
      const { id } = req.params;
      const { authorId, title, publicationDate } = req.body || {};

      if (
        typeof authorId !== 'string' ||
        !authorId.trim() ||
        typeof title !== 'string' ||
        !title.trim() ||
        typeof publicationDate !== 'string' ||
        !publicationDate.trim()
      ) {
        return res.status(400).json({
          message: 'Invalid or missing book fields',
        });
      }

      const database = getDatabase();

      const existingBook = await getBookById(database, id);

      if (!existingBook) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }

      const validAuthor = await authorExists(database, authorId.trim());

      if (!validAuthor) {
        return res.status(400).json({
          message: 'Author does not exist',
        });
      }

      const updatedBook = await updateBookInDb(database, id, {
        authorId: authorId.trim(),
        title: title.trim(),
        publicationDate: publicationDate.trim(),
      });

      return res.status(200).json(updatedBook);
    } catch (error) {
      console.error('Failed to update book:', error.message);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  const deleteBook = async (req, res) => {
    try {
      const { id } = req.params;
      const database = getDatabase();

      const existingBook = await getBookById(database, id);

      if (!existingBook) {
        return res.status(404).json({
          message: 'Book not found',
        });
      }

      await deleteBookInDb(database, id);

      return res.status(204).send();
    } catch (error) {
      console.error('Failed to delete book:', error.message);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  return {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
  };
};

export { createBooksController };
