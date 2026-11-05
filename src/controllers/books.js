import { getAllBooks, getBookById } from '../models/books.js';

const createBooksController = (getDatabase) => {
  const getBooks = async (req, res) => {
    try {
      const books = await getAllBooks(getDatabase());

      return res.status(200).json(books);
    } catch (error) {
      console.error('Failed to retrieve books:', error.message);

      return res.status(500).json({
        message: 'Internal server error'
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
          message: 'Book not found'
        });
      }

      return res.status(200).json(book);
    } catch (error) {
      console.error('Failed to retrieve book:', error.message);

      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  };

  return { getBooks, getBook };
};

export { createBooksController };
