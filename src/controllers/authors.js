
import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorFromDb,
  updateAuthor as updateAuthorFromDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks,
} from '../models/authors.js';
import { getDb } from '../db/connect.js';

const createAuthorsController = (getDatabase = getDb) => {
  const getAllAuthors = async (req, res) => {
    try {
      const authors = await getAllAuthorsFromDb(getDatabase());
      return res.status(200).json(authors);
    } catch {
      return res.status(500).json({
        message: 'Unable to retrieve authors.',
      });
    }
  };

  const getAuthorById = async (req, res) => {
    try {
      const author = await getAuthorByIdFromDb(
        req.params.id,
        getDatabase()
      );

      if (!author) {
        return res.status(404).json({
          message: 'Author not found.',
        });
      }

      return res.status(200).json(author);
    } catch {
      return res.status(500).json({
        message: 'Unable to retrieve author.',
      });
    }
  };

  const createAuthor = async (req, res) => {
    try {
      const { id, name, birthYear } = req.body || {};

      if (
        typeof id !== 'string' ||
        !id.trim() ||
        typeof name !== 'string' ||
        !name.trim() ||
        !Number.isInteger(birthYear) ||
        birthYear > new Date().getFullYear()
      ) {
        return res.status(400).json({
          message: 'Invalid or missing author fields.',
        });
      }

      const db = getDatabase();
      const existingAuthor = await getAuthorByIdFromDb(id, db);

      if (existingAuthor) {
        return res.status(400).json({
          message: 'Author id already exists.',
        });
      }

      const createdAuthor = await createAuthorFromDb({
        id: id.trim(),
        name: name.trim(),
        birthYear,
      }, db);

      return res.status(201).json(createdAuthor);
    } catch {
      return res.status(500).json({
        message: 'Unable to create author.',
      });
    }
  };

  const updateAuthor = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, birthYear } = req.body || {};

      if (
        typeof name !== 'string' ||
        !name.trim() ||
        !Number.isInteger(birthYear) ||
        birthYear > new Date().getFullYear()
      ) {
        return res.status(400).json({
          message: 'Invalid or missing author fields.',
        });
      }

      const db = getDatabase();
      const existingAuthor = await getAuthorByIdFromDb(id, db);

      if (!existingAuthor) {
        return res.status(404).json({
          message: 'Author not found.',
        });
      }

      const updatedAuthor = await updateAuthorFromDb(
        id,
        { name: name.trim(), birthYear },
        db
      );

      return res.status(200).json(updatedAuthor);
    } catch {
      return res.status(500).json({
        message: 'Unable to update author.',
      });
    }
  };

  const deleteAuthor = async (req, res) => {
    try {
      const { id } = req.params;
      const db = getDatabase();

      const existingAuthor = await getAuthorByIdFromDb(id, db);

      if (!existingAuthor) {
        return res.status(404).json({
          message: 'Author not found.',
        });
      }

      if (await authorHasBooks(id, db)) {
        return res.status(409).json({
          message: 'Author cannot be deleted because they still have books.',
        });
      }

      await deleteAuthorFromDb(id, db);
      return res.status(204).send();
    } catch {
      return res.status(500).json({
        message: 'Unable to delete author.',
      });
    }
  };

  return {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };
};

export { createAuthorsController };
