
import { getDb } from '../db/connect.js';

const getAllAuthors = async (db = getDb()) => {
  const collection = db.collection('authors');
  return await collection.find({}).toArray();
};

const getAuthorById = async (id, db = getDb()) => {
  const collection = db.collection('authors');
  return await collection.findOne({ id });
};

const createAuthor = async (author, db = getDb()) => {
  const collection = db.collection('authors');
  await collection.insertOne(author);
  return author;
};

const updateAuthor = async (id, author, db = getDb()) => {
  const collection = db.collection('authors');
  await collection.updateOne({ id }, { $set: author });
  return { id, ...author };
};

const deleteAuthor = async (id, db = getDb()) => {
  const collection = db.collection('authors');
  return await collection.deleteOne({ id });
};

const authorHasBooks = async (id, db = getDb()) => {
  const collection = db.collection('books');
  const count = await collection.countDocuments({ authorId: id });
  return count > 0;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
};
